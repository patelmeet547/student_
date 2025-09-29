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
// import * as Notifications from 'expo-notifications';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import CalendarPicker from 'react-native-calendar-picker';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import SimpleLoader from './Loading';

import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const LeaveScreen = () => {
  const navigation = useNavigation();
  const { userData } = useAuth();
  const classId = userData?.classId;

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
  const [submitting, setSubmitting] = useState(false);

  const [leaves, setLeaves] = useState([]);

  // Fetch leaves function
  const fetchLeaves = async () => {
    if (!userData || !userData._id) {
      setError('User ID not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`https://quantumflux.in:5001/user/${userData._id}/leave`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setLeaves(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error('Fetch leaves error:', err);
      setError(err.message);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLeaves();
  }, [userData]);

  // useEffect(() => {
  //   Notifications.requestPermissionsAsync();
  // }, []);

  const formatDate = (d) => {
    if (!d) return '';
    try {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(d));
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

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
      setReason(leave.title || '');
      setDescription(leave.description || '');
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

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setReason('');
    setDescription('');
    setStartDate(null);
    setEndDate(null);
    setCalendarVisible(false);
    setMenuOpenId(null);
  };

  const handleSave = async () => {
    if (!reason.trim() || !startDate || !endDate) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (!classId) {
      Alert.alert('Error', 'Class ID not found');
      return;
    }

    try {
      setSubmitting(true);

      let url = `https://quantumflux.in:5001/class/${classId}/leave`;
      let method = 'POST';

      // If editing, use POST with leave id in the URL
      if (editingId) {
        url = `https://quantumflux.in:5001/class/${classId}/leave/${editingId}`;
        method = 'POST';
      }

      const body = {
        title: reason.trim(),
        description: description.trim(),
        startDate,
        endDate,
      };

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body),
      });

      if (res.ok || res.status === 204) {
        showSuccessMessage('Your leave has been added successfully');
        // showLocalNotification('Leave Applied', 'Your leave request has been submitted!');
        closeForm();
        await fetchLeaves();
      } else {
        let errorMessage = 'Failed to save leave';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
          } else {
            const errorText = await res.text();
            if (errorText.includes('<html>') || errorText.includes('DOCTYPE')) {
              errorMessage = `Server error (${res.status}). Please try again.`;
            } else {
              errorMessage = errorText || errorMessage;
            }
          }
        } catch (parseError) {
          errorMessage = `Server error (${res.status}). Please try again.`;
        }
        Alert.alert('Error', errorMessage);
      }
    } catch (err) {
      Alert.alert('Error', `Network error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Leave', 
      'Are you sure you want to delete this leave?', 
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              const res = await fetch(
                `https://quantumflux.in:5001/class/${classId}/leave/${id}`, 
                {
                  method: 'DELETE',
                  headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  },
                }
              );

              if (res.ok || res.status === 204) {
                showSuccessMessage('Your leave has been deleted successfully');
                setMenuOpenId(null);
                // Refresh the list
                await fetchLeaves();
              } else {
                let errorMessage = 'Failed to delete leave';
                try {
                  const contentType = res.headers.get('content-type');
                  if (contentType && contentType.includes('application/json')) {
                    const errorData = await res.json();
                    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
                  } else {
                    const errorText = await res.text();
                    if (errorText.includes('<html>') || errorText.includes('DOCTYPE')) {
                      errorMessage = `Server error (${res.status}). Please try again.`;
                    } else {
                      errorMessage = errorText || errorMessage;
                    }
                  }
                } catch (parseError) {
                  errorMessage = `Server error (${res.status}). Please try again.`;
                }
                Alert.alert('Error', errorMessage);
              }

            } catch (err) {
              console.error('Delete error:', err);
              Alert.alert('Error', `Network error: ${err.message}`);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // const showLocalNotification = (title, body) => {
  //   Notifications.scheduleNotificationAsync({
  //     content: {
  //       title,
  //       body,
  //       sound: true,
  //     },
  //     trigger: null, // Show immediately
  //   });
  // };

  if (loading && leaves.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <SimpleLoader />
      </View>
    );
  }

  if (error && leaves.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchLeaves}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topNav}>
          <Header
            onMenuPress={() => navigation.openDrawer()}
            onPortalPress={() => navigation.navigate('StudentDashboard')}
          />
        </View>

        <Text style={styles.title}>Leaves</Text>

        <TouchableOpacity 
          style={[styles.applyBtn, submitting && styles.disabledBtn]} 
          onPress={() => openForm()}
          disabled={submitting}
        >
          <Text style={styles.applyBtnText}>Apply For Leave</Text>
        </TouchableOpacity>

        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>
              {editingId ? 'Update Leave' : 'Ask for Leave'}
            </Text>
            <View style={styles.divider} />

            <Text style={styles.label}>Reason *</Text>
            <TextInput
              style={styles.input}
              placeholder="Write your reason for leave"
              value={reason}
              onFocus={() => setCalendarVisible(false)}
              onChangeText={setReason}
              editable={!submitting}
              placeholderTextColor={'grey'}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Write the details for your reason"
              multiline
              onFocus={() => setCalendarVisible(false)}
              value={description}
              onChangeText={setDescription}
              editable={!submitting}
              placeholderTextColor={'grey'}
            />

            <Text style={styles.label}>Start Date *</Text>
            <TouchableOpacity
              onPress={() => {
                if (!submitting) {
                  setCalendarVisible(true);
                  setCalMode('start');
                }
              }}
              style={[styles.dateField, submitting && styles.disabledField]}
              disabled={submitting}
            >
              <TextInput
                style={styles.dateInput}
                placeholder="Start date"
                value={formatDate(startDate)}
                editable={false}
                placeholderTextColor={'grey'}
              />
              <Icon name="calendar" size={20} color="#FF3B30" />
            </TouchableOpacity>

            <Text style={styles.label}>End Date *</Text>
            <TouchableOpacity
              onPress={() => {
                if (!submitting) {
                  setCalendarVisible(true);
                  setCalMode('end');
                }
              }}
              style={[styles.dateField, submitting && styles.disabledField]}
              disabled={submitting}
            >
              <TextInput
                style={styles.dateInput}
                placeholder="End date"
                value={formatDate(endDate)}
                editable={false}
                placeholderTextColor={'grey'}
              />
              <Icon name="calendar" size={20} color="#FF3B30" />
            </TouchableOpacity>

            {calendarVisible && !submitting && (
              <CalendarPicker
                startFromMonday
                minDate={calMode === 'end' && startDate ? new Date(startDate) : new Date()}
                onDateChange={onDateChange}
                width={width * 0.9}
              />
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.cancelBtn, submitting && styles.disabledBtn]} 
                onPress={closeForm}
                disabled={submitting}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.applyBtnCard, submitting && styles.disabledBtn]} 
                onPress={handleSave}
                disabled={submitting}
              >
                <Text style={styles.applyBtnTextCard}>
                  {submitting ? 'Please wait...' : (editingId ? 'Update' : 'Apply')}

                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {loading && leaves.length > 0 && (
          <View style={styles.refreshing}>
            <Text>Refreshing...</Text>
          </View>
        )}

        <Text style={styles.subtitle}>Recent</Text>
        
        {leaves.length === 0 && !loading ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No leaves found</Text>
          </View>
        ) : (
          leaves.map((item) => {
            if (!item || !item._id) return null;

            let dateText = '';
            if (item.startDate && item.endDate && item.startDate !== item.endDate) {
              try {
                const start = new Date(item.startDate);
                const end = new Date(item.endDate);
                if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
                  dateText = `${start.getDate()} - ${end.getDate()} ${start.toLocaleString('default', { month: 'long' })}, ${start.getFullYear()}`;
                } else {
                  dateText = `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`;
                }
              } catch (error) {
                dateText = 'Invalid date';
              }
            } else if (item.startDate) {
              try {
                const start = new Date(item.startDate);
                dateText = `${start.getDate()} ${start.toLocaleString('default', { month: 'long' })}, ${start.getFullYear()}`;
              } catch (error) {
                dateText = 'Invalid date';
              }
            }

            const isApproved = item.approvedBy && Object.keys(item.approvedBy).length > 0;
            
            return (
              <View key={item._id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardDate}>Leave Date: {dateText}</Text>
                  {isApproved ? (
                    <View style={[styles.statusBadge, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#FF3B30', marginLeft: 8 }]}> 
                      <Text style={[styles.statusText, { color: '#FF3B30', fontWeight: 'bold', fontSize: 12 }]}>APPROVED</Text>
                    </View>
                  ) : (
                    <>
                    <TouchableOpacity 
                      onPress={() => setMenuOpenId(menuOpenId === item._id ? null : item._id)}
                      disabled={submitting}
                    >
                      <Icon name="dots-vertical" size={22} color="#FF3B30" style={{ padding: 4 }} />
                    </TouchableOpacity>
                    </>
                  )}
                  {/* {isApproved && (
                  )} */}
                </View>
                
                <View style={styles.dividerThin} />
                
                <Text style={styles.cardReason}>{item.title || 'No reason provided'}</Text>
                <Text style={styles.cardDesc}>
                  <Text style={{ fontWeight: 'bold' }}>Description:</Text> {item.description || 'No description provided'}
                </Text>
                
                {!isApproved && menuOpenId === item._id && (
                  <View style={[styles.menu, { right: 0, position: 'absolute', top: 40, zIndex: 10 }]}> 
                    <TouchableOpacity 
                      onPress={() => openForm(item)}
                      disabled={submitting}
                    >
                      <Text style={styles.menuText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDelete(item._id)}
                      disabled={submitting}
                    >
                      <Text style={[styles.menuText, { color: 'red' }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}

        {/* <TouchableOpacity
          style={{ margin: 20, backgroundColor: '#FF3B30', padding: 10, borderRadius: 10 }}
          onPress={() => Notifications.scheduleNotificationAsync({
            content: {
              title: 'Test Notification',
              body: 'This is a test!',
              sound: true,
            },
            trigger: null,
          })}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>Send Test Notification</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5', flex: 1 },
  topNav: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', margin: 20 },

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
    marginHorizontal: 20,
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  menuText: { paddingVertical: 4, fontSize: 14 },

  // Additional styles for error handling and loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  disabledField: {
    opacity: 0.6,
  },
  refreshing: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default LeaveScreen;