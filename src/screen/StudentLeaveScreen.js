// 📁 LeaveScreen.js
import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

const LeaveScreen = () => {
  const navigation = useNavigation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calMode, setCalMode] = useState('start');

  const [leaves, setLeaves] = useState([]);

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
      setReason(leave.reason);
      setDescription(leave.description);
      setStartDate(leave.rawStart);
      setEndDate(leave.rawEnd);
      setEditingId(leave.id);
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

  const handleSave = () => {
    if (!reason || !startDate || !endDate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const dateText =
      formatDate(startDate) === formatDate(endDate)
        ? formatDate(startDate)
        : `${formatDate(startDate)} - ${formatDate(endDate)}`;

    const newEntry = {
      id: editingId || Date.now(),
      reason,
      description,
      rawStart: startDate,
      rawEnd: endDate,
      dateText,
      status: 'Approved', // Example status
    };

    const updatedLeaves = editingId
      ? leaves.map((l) => (l.id === editingId ? newEntry : l))
      : [newEntry, ...leaves];

    setLeaves(updatedLeaves);
    setShowForm(false);
    setEditingId(null);
    setMenuOpenId(null);

    showSuccessMessage(
      editingId ? 'Your leave has been updated successfully' : 'Your leave has been added successfully'
    );
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Are you sure you want to delete this leave?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setLeaves((prev) => prev.filter((l) => l.id !== id));
          showSuccessMessage('Your leave has been deleted successfully');
        },
      },
    ]);
  };

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
        {leaves.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardDate}>Leave Date: {item.dateText}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.dividerThin} />

            <Text style={styles.cardReason}>{item.reason}</Text>
            <Text style={styles.cardDesc}>
              <Text style={{ fontWeight: 'bold' }}>Description:</Text> {item.description}
            </Text>

            {menuOpenId === item.id && (
              <View style={styles.menu}>
                <TouchableOpacity onPress={() => openForm(item)}>
                  <Text style={styles.menuText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={[styles.menuText, { color: 'red' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  topNav: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },

  applyBtn: {
    backgroundColor: '#FF3B30',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 20,
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

  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },

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
