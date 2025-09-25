import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const schoolLogo = require('../assets/img/logo.png');

const { width, height } = Dimensions.get('window');

const SidebarScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedItem, setSelectedItem] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', icon: 'view-dashboard-outline', screen: 'StudentDashboard' },
    { label: 'Attendance', icon: 'calendar-check-outline', screen: 'StudentAttendance' },
    { label: 'Announcement', icon: 'bullhorn-outline', screen: 'AnnouncementScreen' },
    { label: 'Homework', icon: 'book-outline', screen: 'HomeworkScreen' },
    { label: 'Leaves', icon: 'file-document-outline', screen: 'LeaveScreen' },
  ];

  useEffect(() => {
    setSelectedItem(route.name);
  }, [route.name]);

  const handleNavigation = (screenName) => {
    setSelectedItem(screenName);
    navigation.navigate(screenName);
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const resp = await fetch('https://quantumflux.in:5001/auth/logout', {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      if (resp.status === 204) {
        await AsyncStorage.multiRemove(['isLoggedIn', 'studentId', 'token']);
        setShowLogoutConfirm(false);
        await logout();
      } else Alert.alert('Logout Failed', 'Could not log out. Please try again.');
    } catch {
      Alert.alert('Logout Failed', 'Could not log out. Please try again.');
    }
  };

  return (
    <View style={styles.fullContainer}>
      <View style={styles.sidebarContainer}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.schoolHeaderContainer}>
            <View style={styles.header}>
              <Image source={schoolLogo} style={styles.logo} />
              <View style={styles.schoolInfo}>
                <Text style={styles.schoolName}>KALAM VIDYASANSKAR</Text>
                <Text style={styles.schoolName}>PATSHALA CBSE SCHOOL</Text>
                <Text style={styles.location}>THANJAVUR DISTRICT - 613203</Text>
              </View>
            </View>
          </View>

          <Text style={styles.menuTitle}>Overview</Text>

          {menuItems.map((item, idx) => {
            const navState = navigation.getState();
            const currentRoute = navState.routes[navState.index]?.name;
            const isActive = currentRoute === item.screen;
            const iconColor = isActive ? '#E53935' : '#9CA3AF';
            const labelColor = '#111111';

            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.menuItem,
                  isActive && styles.menuItemActive,
                ]}
                onPress={() => handleNavigation(item.screen)}
              >
                <Icon name={item.icon} size={width * 0.05} color={iconColor} style={styles.menuIcon} />
                <Text style={[styles.menuLabel, { color: labelColor }]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Modal
          visible={showLogoutConfirm}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLogoutConfirm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Are you sure you want to logout?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowLogoutConfirm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutItem} onPress={() => setShowLogoutConfirm(true)}>
            <Icon name="logout" size={width * 0.05} color="white" style={styles.logoutIcon} />
            <Text style={styles.logoutLabel}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SidebarScreen;

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: width * 0.7,
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  scrollView: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.03,
  },
  schoolHeaderContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E57373',
    borderTopRightRadius: 30,
    paddingVertical: height * 0.02,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.04,
  },
  logo: {
    height: height * 0.07,
    width: height * 0.07,
    borderRadius: height * 0.035,
    marginLeft: -width * 0.04,
    marginRight: width * 0.04,
  },
  schoolInfo: {
    flexShrink: 1,
  },
  schoolName: {
    fontWeight: 'bold',
    fontSize: width * 0.03,
    color: '#111',
  },
  location: {
    fontSize: width * 0.027,
    color: '#666',
    marginTop: 2,
  },
  menuTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginTop: height * 0.02,
    marginBottom: height * 0.015,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#E0BBE4',
  },
  menuItemActive: {
    backgroundColor: 'rgba(229, 57, 53, 0.05)',
  },
  menuIcon: {
    marginRight: width * 0.04,
  },
  menuLabel: {
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  logoutContainer: {
    padding: width * 0.05,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIcon: {
    backgroundColor: '#ff3c3c',
    padding: width * 0.025,
    borderRadius: 50,
    marginRight: width * 0.04,
  },
  logoutLabel: {
    fontSize: width * 0.04,
    color: '#ff3c3c',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: width * 0.08,
    minWidth: width * 0.7,
    alignItems: 'center',
  },
  modalText: {
    fontSize: width * 0.045,
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.06,
    marginRight: width * 0.03,
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    color: '#222',
    fontSize: width * 0.04,
  },
  logoutButton: {
    backgroundColor: '#ff3c3c',
    borderRadius: 8,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.06,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
});
