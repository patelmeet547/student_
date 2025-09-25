// 📁 StudentDashboard.js
import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import SimpleLoader from './Loading';

const CalendarTicketIcon = ({ date }) => {
  // Function to add ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return num + "st";
    if (j === 2 && k !== 12) return num + "nd";
    if (j === 3 && k !== 13) return num + "rd";
    return num + "th";
  };

  return (
    <View style={styles.calendarContainer}>
      {/* Red Box Background */}
      <View style={styles.redBox}>
        {/* Month Label */}
        {/* <View style={styles.monthLabelContainer}>
          <Text style={styles.monthLabel}>
            {moment().format('MMM').toUpperCase()}
          </Text>
        </View> */}
        
        {/* Date with Ordinal */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateNumber}>{date}</Text>
          <Text style={styles.ordinalSuffix}>
            {getOrdinalSuffix(date).replace(date.toString(), '')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const StudentDashboard = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { userData } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        
        // Fetch user/events
        const userRes = await fetch('https://quantumflux.in:5001/user/me');
        const userData = await userRes.json();
        setUser(userData.user);
        setEvents(userData.events || []);
        
        // Fetch attendance using same API as StudentAttendance component
        if (userData.user?.class?._id) {
          const attRes = await fetch(`https://quantumflux.in:5001/class/${userData.user.class._id}/attendance`);
          const attData = await attRes.json();
          setAttendanceData(attData);
        }
        
        // Fetch announcements
        if (userData.user?.class?._id) {
          const annRes = await fetch(`https://quantumflux.in:5001/class/${userData.user.class._id}/announcement`);
          const annData = await annRes.json();
          setAnnouncements(annData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Use EXACT same logic as StudentAttendance component
  const getMonthAttendanceDays = (monthMoment) => {
    const daysInMonth = monthMoment.daysInMonth();
    const currentDate = moment();

    const filtered = attendanceData.filter((item) => {
      const date = moment(item.date);
      return date.month() === monthMoment.month() && date.year() === monthMoment.year();
    });

    const grouped = {};
    filtered.forEach((item) => {
      const dayKey = moment(item.date).format('YYYY-MM-DD');
      if (!grouped[dayKey]) grouped[dayKey] = [];
      grouped[dayKey].push(item);
    });

    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = moment(monthMoment).date(d);
      const dayKey = dateObj.format('YYYY-MM-DD');
      const records = grouped[dayKey] || [];

      let status = null;

      // Only process past and current dates (same as StudentAttendance)
      if (dateObj.isSameOrBefore(currentDate, 'day')) {
        if (records.length > 0) {
          const attendanceStatus = records[0].present; // Same logic as StudentAttendance
          if (attendanceStatus === true) {
            status = 'Present';
          } else if (attendanceStatus === false) {
            status = 'Absent';
          }
        }
        // If no records found, don't set any status (null) - same as StudentAttendance
      }

      days.push({
        date: d,
        status,
        _id: dayKey,
        isFuture: dateObj.isAfter(currentDate, 'day'),
      });
    }
    return days;
  };

  // Attendance summary for current month - filter out future dates like StudentAttendance
  const monthAttendance = getMonthAttendanceDays(currentMonth).filter(day => !day.isFuture);
  const presentCount = monthAttendance.filter((d) => d.status === 'Present').length;
  const absentCount = monthAttendance.filter((d) => d.status === 'Absent').length;
  const totalCount = presentCount + absentCount; // Only count days with actual data
  
  // Calculate overall attendance percentage from all months with data
  const getAllMonthsAttendance = () => {
    let totalPresent = 0;
    let totalDays = 0;
    
    // Get all months that have attendance data
    const allMonths = [...new Set(attendanceData.map(item => moment(item.date).format('YYYY-MM')))];
    
    allMonths.forEach(monthStr => {
      const [year, month] = monthStr.split('-');
      const monthMoment = moment().year(parseInt(year)).month(parseInt(month) - 1);
      const days = getMonthAttendanceDays(monthMoment).filter(day => !day.isFuture);
      const monthPresent = days.filter((d) => d.status === 'Present').length;
      const monthAbsent = days.filter((d) => d.status === 'Absent').length;
      const monthTotal = monthPresent + monthAbsent;
      
      totalPresent += monthPresent;
      totalDays += monthTotal;
    });
    
    return { totalPresent, totalDays };
  };
  
  const overallAttendance = getAllMonthsAttendance();
  const attendancePct = overallAttendance.totalDays > 0 ? Math.round((overallAttendance.totalPresent / overallAttendance.totalDays) * 100) : 0;

  // Updated: Use current actual month instead of the selected month for breakdown
  const getLastNMonths = (n) => {
    const arr = [];
    let currentActualMonth = moment(); // Use actual current date, not the selected currentMonth
    for (let i = 0; i < n; i++) {
      arr.push(moment(currentActualMonth).subtract(i, 'month'));
    }
    return arr.reverse();
  };
  
  const breakdownMonths = getLastNMonths(3);
  const attendanceBreakdown = breakdownMonths.map((m) => {
    const days = getMonthAttendanceDays(m).filter(day => !day.isFuture);
    const attended = days.filter((d) => d.status === 'Present').length;
    const absent = days.filter((d) => d.status === 'Absent').length;
    const total = attended + absent; // Only count days with data
    return {
      month: m.format('MMMM YYYY'),
      attended,
      total,
    };
  });

  // Announcements (latest 5)
  const latestAnnouncements = announcements.slice(0, 5);

  // Events for current month
  const currentMonthEvents = (events || []).filter(ev => {
    const d = new Date(ev.date);
    return (
      d.getMonth() === currentMonth.month() &&
      d.getFullYear() === currentMonth.year()
    );
  });

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
    <View style={styles.container}>
      {/* --- Reusable Header --- */}
      <Header
        onPortalPress={() => navigation.navigate('StudentAttendance')}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* === Profile Card === */}
        <View style={[styles.profileCard, { width: width - 32 }]}>
          <View style={styles.cardShadow}>
            <ImageBackground
              source={require('../assets/img/pattern.png')}
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
                <Text style={styles.classText}>
                  CLASS: {user?.class?.name || ''}
                </Text>
              </View>
            </ImageBackground>

            <View style={styles.avatarWrapper}>
              <Image
                source={user?.image ? {  uri: user.image.startsWith('http') ? user.image : `https://quantumflux.in:5000${user.image}` } : require('../assets/img/as.jpg')}
                style={styles.avatar}
              />
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.studentName}>{user?.name || ''}</Text>
              <View style={styles.bottomInfoRow}>
                <Text style={styles.infoText}>Roll no: {user?.rollno ?? ''}</Text>
                <View style={styles.separator} />
                <Text style={styles.infoText}>Enrolled on: {user?.enrolledDate || ''}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* === Holidays & Events === */}
        <Text style={styles.sectionTitle}>Holidays & Events</Text>
        <View style={styles.eventContainer}>
          <LinearGradient colors={['#f8f4f4ff', '#eeeeeeff']} style={styles.monthNav}>
            <TouchableOpacity onPress={() => setCurrentMonth(prev => moment(prev).subtract(1, 'month'))}>
              <View style={styles.iconBorder}>
                <Icon name="chevron-left" size={26} color="#000000" />
              </View>
            </TouchableOpacity>
            <Text style={styles.monthText}>{currentMonth.format('MMMM YYYY')}</Text>
            <TouchableOpacity onPress={() => setCurrentMonth(prev => moment(prev).add(1, 'month'))}>
              <View style={styles.iconBorder}>
                <Icon name="chevron-right" size={26} color="#000000" />
              </View>
            </TouchableOpacity>
          </LinearGradient>
          {currentMonthEvents.length > 0 ? (
            currentMonthEvents.map((item, index) => {
              const d = new Date(item.date);
              const dayNumber = d.getDate();
              return (
                <View key={index} style={styles.holidayCard}>
                  <View style={styles.eventIconContainer}>
                    <CalendarTicketIcon date={dayNumber} />
                  </View>
                  <View style={styles.holidayDetails}>
                    <Text style={styles.eventName}>{item.name}</Text>
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
              <Icon name="application-edit-outline" size={22} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.statValue}>{presentCount}/{totalCount}</Text>
            <Text style={styles.statLabel}>Total Days Present</Text>
          </View>
          <View style={styles.statBox}>
            <LinearGradient colors={['#FB344B', '#FB344B']} style={styles.iconCircle}>
              <Icon name="calendar-clock-outline" size={22} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.statValue}>{attendancePct}%</Text>
            <Text style={styles.statLabel}>Attendance Percentage</Text>
          </View>
        </View>
        
        {/* === Attendance Breakdown === */}
        <View style={styles.attendanceCard}>
          {attendanceBreakdown.map((item, index) => {
            const progress = item.total > 0 ? item.attended / item.total : 0;
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
        <View style={{ paddingHorizontal: 0}}>
          {latestAnnouncements.map((item, i) => (
            <TouchableOpacity
              style={[
                styles.announcementCard,
                { marginBottom: 12, marginHorizontal: 4, backgroundColor: '#fff', borderRadius: 10, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }
              ]}
              key={item._id || i}
              onPress={() => navigation.navigate('AnnouncementScreen', { announcement: item })}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.announcementTitle, { fontSize: 15, marginBottom: 4 }]} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
                <Text style={[styles.announcementSub, { fontSize: 12, color: '#888' }]}> {moment(item.createdAt).format('DD-MMM-YYYY')} · {item.user?.name || 'Admin'} </Text>
              </View>
            </TouchableOpacity>
          ))}
          {announcements.length === 0 && (
            <Text style={styles.noEventsText}>No announcements available.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 16, paddingBottom: 40 },

  profileCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
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
    backgroundColor: 'rgba(22, 22, 22, 0.3)',
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
  monthText: { fontWeight: '800', fontSize: 15, color: '#000000ff'},

  holidayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.4,
    borderBottomColor: '#CA71D6',
  },
  
  // Updated calendar icon styles - Red box design
  eventIconContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  calendarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  redBox: {
    width: 50,
    height: 55,
    backgroundColor: '#FB344B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FB344B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  monthLabelContainer: {
    backgroundColor: '#FB344B',
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 2,
  },
  dateNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ordinalSuffix: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 1,
    marginTop: -8,
  },
  
  holidayDetails: { flex: 1 },
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
  announcementTitle: { fontWeight: 'bold', fontSize: 14 },
  announcementSub: { fontSize: 12, color: '#000000', marginTop: 2 },
});

export default StudentDashboard;