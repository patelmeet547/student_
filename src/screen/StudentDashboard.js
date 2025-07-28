// 📁 StudentDashboard.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/Header'; // <-- adjust the path to where you saved it

const holidayData = {
  '2025-07': [
    { name: 'Karkidaka Vavu Bali', date: 'Tuesday, 3rd July' },
    { name: 'Karkidaka Vavu Bali', date: 'Tuesday, 27th July' },
  ],
  '2025-08': [
    { name: 'Independence Day', date: 'Thursday, 15th August' },
    { name: 'Raksha Bandhan', date: 'Monday, 19th August' },
  ],
};

const StudentDashboard = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const [currentMonth, setCurrentMonth] = useState(moment());
  const holidays = holidayData[currentMonth.format('YYYY-MM')] || [];

  const goToPreviousMonth = () =>
    setCurrentMonth(prev => moment(prev).subtract(1, 'month'));
  const goToNextMonth = () =>
    setCurrentMonth(prev => moment(prev).add(1, 'month'));

  return (
    <View style={styles.container}>
      {/* --- Reusable Header --- */}
      <Header
        onMenuPress={() => navigation.openDrawer()}
        onPortalPress={() => navigation.navigate('StudentAttendance')} // <-- change target as needed
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* === Profile Card === */}
        <View style={[styles.profileCard, { width: width - 32 }]}>
          <View style={styles.cardShadow}>
            <ImageBackground
              source={require('D:/reactnative/student_erp/src/assets/img/pattern.png')}
              resizeMode="cover"
              style={styles.gradientHeader}
              imageStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            >
              <LinearGradient
                colors={['#FFFFFF', '#FB344B']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={[
                  StyleSheet.absoluteFillObject,
                  { opacity: 0.85, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
                ]}
              />

              <View style={styles.classTag}>
                <Text style={styles.classText}>CLASS: VI B</Text>
              </View>
            </ImageBackground>

            <View style={styles.avatarWrapper}>
              <Image
                source={require('D:/reactnative/student_erp/src/assets/img/as.jpg')}
                style={styles.avatar}
              />
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.studentName}>Aarav Mehta</Text>
              <View style={styles.bottomInfoRow}>
                <Text style={styles.infoText}>Roll no: 1</Text>
                <View style={styles.separator} />
                <Text style={styles.infoText}>Enrolled on: 2020‑01‑01</Text>
              </View>
            </View>
          </View>
        </View>

        {/* === Holidays === */}
        <Text style={styles.sectionTitle}>Holidays & Events</Text>
        <View style={styles.eventContainer}>
          <LinearGradient colors={['#f8f4f4ff', '#eeeeeeff']} style={styles.monthNav}>
            <TouchableOpacity onPress={goToPreviousMonth}>
              <View style={styles.iconBorder}>
                <Icon name="chevron-left" size={26} color="#000000" />
              </View>
            </TouchableOpacity>

            <Text style={styles.monthText}>{currentMonth.format('MMMM YYYY')}</Text>

            <TouchableOpacity onPress={goToNextMonth}>
              <View style={styles.iconBorder}>
                <Icon name="chevron-right" size={26} color="#000000" />
              </View>
            </TouchableOpacity>
          </LinearGradient>

          {holidays.length > 0 ? (
            holidays.map((item, index) => {
              const dayNumber = item.date.match(/\d{1,2}/)?.[0] || '';
              return (
                <View key={index} style={styles.holidayCard}>
                  <LinearGradient colors={['#FB344B', '#FB344B']} style={styles.holidayIcon}>
                    <Text style={styles.holidayDay}>{dayNumber}</Text>
                  </LinearGradient>
                  <View style={styles.holidayDetails}>
                    <Text style={styles.eventName}>{item.name}</Text>
                    <Text style={styles.eventDate}>{item.date}</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.noEventsText}>No events this month.</Text>
          )}
        </View>

        {/* === Attendance Summary === */}
        <Text style={styles.sectionTitle}>Attendance Summary</Text>
        <View style={styles.attendanceSummary}>
          <View style={[styles.statBox, { marginRight: 8 }]}>
            <LinearGradient colors={['#FB344B', '#fb344ba6']} style={styles.iconCircle}>
              <Icon name="calendar-check-outline" size={22} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.statValue}>42/57</Text>
            <Text style={styles.statLabel}>Total Days Present</Text>
          </View>
          <View style={styles.statBox}>
          <LinearGradient colors={['#FB344B', '#FB344B']} style={styles.iconCircle}>
              <Icon name="calendar-percent" size={22} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.statValue}>74%</Text>
            <Text style={styles.statLabel}>Attendance Percentage</Text>
          </View>
        </View>

        {/* === Attendance Breakdown === */}
        <View style={styles.attendanceCard}>
          {[
            { month: 'June 2025', attended: 17, total: 30 },
            { month: 'May 2025', attended: 24, total: 26 },
            { month: 'April 2025', attended: 1, total: 1 },
          ].map((item, index) => {
            const progress = item.attended / item.total;
            return (
              <View key={index} style={styles.attendanceRow}>
                <Text style={styles.attendanceMonth}>{item.month}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressWrapper}>
                    <LinearGradient
                      colors={['#000000', '#FB344B']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressFill, { width: `${progress * 100}%` }]}
                    />
                  </View>
                  <Text style={styles.attendanceCount}>
                    {item.attended}/{item.total}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* === Announcements === */}
        <Text style={styles.sectionTitle}>Announcements</Text>
        {['Raksha Bandhan', 'Summer Break'].map((title, i) => (
          <View style={styles.announcementCard} key={i}>
            <View>
              <Text style={styles.announcementTitle}>{title}</Text>
              <Text style={styles.announcementSub}>27‑June‑2025 · Principal</Text>
            </View>
            <View style={styles.micContainer}>
              <View style={styles.micCircle}>
                <Icon name="microphone" size={20} color="#ffffffff" />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 16, paddingBottom: 40 },

  profileCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    alignSelf: 'center',
  },
  cardShadow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconBorder: {
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 4,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  gradientHeader: {
    height: 70,
    justifyContent: 'center',
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  classTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  classText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  avatarWrapper: {
    position: 'absolute',
    top: 35,
    left: 16,
    zIndex: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  infoSection: {
    marginTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  bottomInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#000000',
  },
  separator: {
    width: 1,
    height: 14,
    backgroundColor: '#000000',
    marginHorizontal: 10,
  },

  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 8 },

  eventContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 3,
    paddingVertical: 10,
    marginBottom: 16,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginHorizontal: 6,
  },
  monthText: { fontWeight: '800', fontSize: 15, color: '#000000ff' },

  holidayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
  },
  holidayIcon: {
    width: 35,
    height: 45,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  holidayDay: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  holidayDetails: { marginLeft: 12 },
  eventName: { fontSize: 14, fontWeight: '600' },
  eventDate: { fontSize: 12, color: '#000000' },
  noEventsText: { textAlign: 'center', color: '#000000', fontStyle: 'italic', marginTop: 8 },

  attendanceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    elevation: 3,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#000000',
    textAlign: 'center',
  },

  attendanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginTop: 16,
    elevation: 3,
  },
  attendanceRow: { marginBottom: 20 },
  attendanceMonth: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressWrapper: {
    flex: 1,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#bebebeff',
    overflow: 'hidden',
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  attendanceCount: {
    width: 45,
    textAlign: 'right',
    fontWeight: '600',
    color: '#000000',
    fontSize: 13,
  },

  announcementCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  micContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  micCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FB344B',
    backgroundColor: '#FB344B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementTitle: { fontWeight: 'bold', fontSize: 14 },
  announcementSub: { fontSize: 12, color: '#000000', marginTop: 2 },
});

export default StudentDashboard;
