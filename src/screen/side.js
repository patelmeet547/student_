import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const SidebarScreen = () => {
  const navigation = useNavigation();

  const menuItems = [
    { label: 'Dashboard', icon: 'view-dashboard-outline', screen: 'StudentDashboard' },
    { label: 'Attendance', icon: 'calendar-check-outline', screen: 'StudentAttendance' },
    { label: 'Announcement', icon: 'bullhorn-outline', screen: 'AnnouncementScreen' },
    { label: 'Homework', icon: 'book-outline' , screen: 'HomeworkScreen' },
    { label: 'Leaves', icon: 'file-document-outline' , screen: 'LeaveScreen' },
  ];

  return (
    <View style={styles.fullContainer}>
      <View style={styles.sidebarContainer}>
        <View style={styles.scrollContainer}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            {/* Header Container with Full Width */}
            <View style={styles.schoolHeaderContainer}>
              <View style={styles.header}>
                <Image
                  source={{
                    uri: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Red-circle-icon.png',
                  }}
                  style={styles.logo}
                />
                <View style={styles.schoolInfo}>
                  <Text style={styles.schoolName}>KALAM VIDYASANSKAR</Text>
                  <Text style={styles.schoolName}>PATSHALA CBSE SCHOOL</Text>
                  <Text style={styles.location}>THANJAVUR DISTRICT - 613203</Text>
                </View>
              </View>
            </View>

            {/* Menu Title */}
            <Text style={styles.menuTitle}>Overview</Text>

            {/* Menu Items */}
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  if (item.screen) navigation.navigate(item.screen);
                }}
              >
                <View style={styles.iconCircle}>
                  <Icon name={item.icon} size={20} color="white" />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Logout fixed at bottom */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutItem}>
            <Icon name="logout" size={20} color="white" style={styles.logoutIcon} />
            <Text style={styles.logoutLabel}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Right half for visualization */}
      <View style={styles.restOfScreen}>
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#aaa' }}>Main Content</Text>
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
    width: screenWidth * 0.65,
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  schoolHeaderContainer: {
    backgroundColor: '#c39dd8ff',
    borderTopRightRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 0,
    margin: 0,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  schoolInfo: {
    flexShrink: 1,
  },
  schoolName: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#fff',
  },
  location: {
    fontSize: 11,
    color: '#ddd',
    marginTop: 2,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  iconCircle: {
    backgroundColor: '#d45aff',
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  menuLabel: {
    fontSize: 14,
    color: '#333',
  },
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIcon: {
    backgroundColor: '#ff3c3c',
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  logoutLabel: {
    fontSize: 14,
    color: '#ff3c3c',
    fontWeight: 'bold',
  },
  restOfScreen: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});
 