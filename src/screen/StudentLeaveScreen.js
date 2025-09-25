// 📁 LeaveScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ToastAndroid,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CalendarPicker from 'react-native-calendar-picker';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import SimpleLoader from './Loading';

import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const LeaveScreen = () => {
  const navigation = useNavigation();
  const { userData } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calMode, setCalMode] = useState('start');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      if (!userData || !userData._id) {
        setError('User ID not found');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`https://quantumflux.in:5001/user/${userData._id}/leave`);
        if (!res.ok) throw new Error('Failed to fetch leaves');
        const data = await res.json();
        setLeaves(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, [userData]);

  const formatDate = (d) =>
    d
      ? new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(new Date(d))
      : '';

  const showSuccessMessage = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', msg);
    }
  };

  const onDateChange = (date) => {
    const selected = date.toISOString();
    if (calMode === 'start') {
      setStartDate(selected);
      if (endDate && new Date(selected) > new Date(endDate)) {
        setEndDate(null);
      }
    } else {
      setEndDate(selected);
    }
    setCalendarVisible(false);
  };

  const openForm = (leave = null) => {
    if (leave) {
      setReason(leave.title);
      setDescription(leave.description);
      setStartDate(leave.startDate);
      setEndDate(leave.endDate);
      setEditingId(leave._id);
    } else {
      setReason('');
      setDescription('');
      setStartDate(null);
      setEndDate(null);
      setEditingId(null);
    }
    setCalendarVisible(false);
    setShowForm(true);
  };

  // CREATE or UPDATE leave
  const handleSave = async () => {
    if (!reason || !startDate || !endDate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      let url = `https://quantumflux.in:5001/user/${userData._id}/leave`;
      let method = 'POST';
      if (editingId) {
        url += `/${editingId}`;
        // method = 'PUT'; // Try PUT if POST fails for update
        // method = 'PATCH'; // Try PATCH if needed
        method = 'POST'; // Default: POST (as per your Postman)
      }
      const body = {
        title: reason,
        description,
        startDate,
        endDate,
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok && res.status !== 204) {
        let errMsg = 'Failed to save leave';
        try {
          const errJson = await res.clone().json();
          errMsg = errJson.message || JSON.stringify(errJson);
        } catch (e) {
          const errText = await res.text();
          errMsg = errText;
        }
        Alert.alert('Error', errMsg);
        setLoading(false);
        return;
      }
      showSuccessMessage(editingId ? 'Your leave has been updated successfully' : 'Your leave has been added successfully');
      setShowForm(false);
      setEditingId(null);
      setMenuOpenId(null);
      // Refresh leave list
      setLoading(true);
      setError(null);
      const leavesRes = await fetch(`https://quantumflux.in:5001/user/${userData._id}/leave`);
      const leavesData = await leavesRes.json();
      setLeaves(leavesData);
      setLoading(false);
      setMenuOpenId(null); 
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  // DELETE leave
  const handleDelete = async (id) => {
    Alert.alert('Delete', 'Are you sure you want to delete this leave?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`https://quantumflux.in:5001/user/${userData._id}/leave/${id}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok && res.status !== 204) throw new Error('Failed to delete leave');
            showSuccessMessage('Your leave has been deleted successfully');
            // Refresh leave list
            setLoading(true);
            setError(null);
            const leavesRes = await fetch(`https://quantumflux.in:5001/user/${userData._id}/leave`);
            const leavesData = await leavesRes.json();
            setLeaves(leavesData);
            setLoading(false); // <-- fix: stop loading after delete
            setMenuOpenId(null); // <-- fix: close menu after delete
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <SimpleLoader />
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.topNav}>
          <Header
            onMenuPress={() => navigation.openDrawer()}
            onPortalPress={() => navigation.navigate('StudentDashboard')}
          />
        </View>

        <Text style={styles.title}>Leaves</Text>

        <TouchableOpacity style={styles.applyBtn} onPress={() => openForm()}>
          <Text style={styles.applyBtnText}>Apply For Leave</Text>
        </TouchableOpacity>

        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{editingId ? 'Update Leave' : 'Ask for Leave'}</Text>
            <View style={styles.divider} />

            <Text style={styles.label}>Reason</Text>
            <TextInput
              style={styles.input}
              placeholder="Write your reason for leave"
              value={reason}
              onFocus={() => setCalendarVisible(false)}
              onChangeText={setReason}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Write the details for your reason"
              multiline
              onFocus={() => setCalendarVisible(false)}
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>Start On</Text>
            <TouchableOpacity
              onPress={() => {
                setCalendarVisible(true);
                setCalMode('start');
              }}
              style={styles.dateField}
            >
              <TextInput
                style={styles.dateInput}
                placeholder="Start date"
                value={formatDate(startDate)}
                editable={false}
              />
              <Icon name="calendar" size={20} color="#FF3B30" />
            </TouchableOpacity>

            <Text style={styles.label}>End On</Text>
            <TouchableOpacity
              onPress={() => {
                setCalendarVisible(true);
                setCalMode('end');
              }}
              style={styles.dateField}
            >
              <TextInput
                style={styles.dateInput}
                placeholder="End date"
                value={formatDate(endDate)}
                editable={false}
              />
              <Icon name="calendar" size={20} color="#FF3B30" />
            </TouchableOpacity>

            {calendarVisible && (
              <CalendarPicker
                startFromMonday
                minDate={calMode === 'end' && startDate ? new Date(startDate) : new Date()}
                onDateChange={onDateChange}
                width={width * 0.9}
              />
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtnCard} onPress={handleSave}>
                <Text style={styles.applyBtnTextCard}>{editingId ? 'Update' : 'Apply'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.subtitle}>Recent</Text>
        {leaves.map((item) => {
          // Format date as '26 - 29 June, 2025' or '26 June, 2025'
          let dateText = '';
          if (item.startDate && item.endDate && item.startDate !== item.endDate) {
            const start = new Date(item.startDate);
            const end = new Date(item.endDate);
            if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
              dateText = `${start.getDate()} - ${end.getDate()} ${start.toLocaleString('default', { month: 'long' })}, ${start.getFullYear()}`;
            } else {
              dateText = `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`;
            }
          } else if (item.startDate) {
            const start = new Date(item.startDate);
            dateText = `${start.getDate()} ${start.toLocaleString('default', { month: 'long' })}, ${start.getFullYear()}`;
          }
          // Show APPROVED badge only if approvedBy key exists and is not null/empty
          const isApproved = item.approvedBy && Object.keys(item.approvedBy).length > 0;
          return (
            <View key={item._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardDate}>Leave Date: {dateText}</Text>
                {isApproved ? (
                  // Static 3-dot icon (disabled look)
                  <Icon name="dots-vertical" size={22} color="#ccc" style={{ padding: 4, opacity: 0.5 }} />
                ) : (
                  <TouchableOpacity onPress={() => setMenuOpenId(menuOpenId === item._id ? null : item._id)}>
                    <Icon name="dots-vertical" size={22} color="#FF3B30" style={{ padding: 4 }} />
                  </TouchableOpacity>
                )}
                {isApproved && (
                  <View style={[styles.statusBadge, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#FF3B30', marginLeft: 8 }]}> 
                    <Text style={[styles.statusText, { color: '#FF3B30', fontWeight: 'bold', fontSize: 12 }]}>APPROVED</Text>
                  </View>
                )}
              </View>
              <View style={styles.dividerThin} />
              <Text style={styles.cardReason}>{item.title}</Text>
              <Text style={styles.cardDesc}>
                <Text style={{ fontWeight: 'bold' }}>Description:</Text> {item.description}
              </Text>
              {/* Only show menu if NOT approved */}
              {!isApproved && menuOpenId === item._id && (
                <View style={[styles.menu, { right: 0, position: 'absolute', top: 40, zIndex: 10 }]}> 
                  <TouchableOpacity onPress={() => openForm({
                    ...item,
                    reason: item.title,
                    rawStart: item.startDate,
                    rawEnd: item.endDate,
                    id: item._id,
                  })}>
                    <Text style={styles.menuText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Text style={[styles.menuText, { color: 'red' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
          );
        })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5', flex: 1 },
  topNav: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', margin : 20 },

  applyBtn: {
    backgroundColor: '#FF3B30',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  applyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  formCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 20,
  },
  formTitle: { textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  divider: { height: 2, backgroundColor: '#FF3B30', width: '20%', alignSelf: 'center', marginBottom: 16 },
  label: { fontWeight: 'bold', marginTop: 12 },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 4,
    fontSize: 14,
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 4,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  dateInput: { flex: 1, paddingVertical: 10, fontSize: 14 },

  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelBtn: {
    borderColor: '#FF3B30',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  cancelText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 15 },
  applyBtnCard: {
    backgroundColor: '#FF3B30',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  applyBtnTextCard: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8, marginLeft: 20 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 1,
    marginTop: 20,
    marginHorizontal: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardDate: { fontWeight: '600', fontSize: 13 },
  dividerThin: {
    height: 1,
    backgroundColor: '#FF3B30',
    marginVertical: 8,
  },
  cardReason: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  cardDesc: { marginBottom: 6, fontSize: 14 },
  menu: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  menuText: { paddingVertical: 4, fontSize: 14 },
});

export default LeaveScreen;
