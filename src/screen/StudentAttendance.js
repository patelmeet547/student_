// StudentAttendance.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { PieChart as DonutChart } from 'react-native-svg-charts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Text as SVGText, G, Circle } from 'react-native-svg';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import SimpleLoader from './Loading';

const screenWidth = Dimensions.get('window').width;

const CalendarBar = ({ label, onPrev, onNext }) => (
  <View style={styles.calendarBar}>
    <TouchableOpacity onPress={onPrev} style={styles.navBtn}>
      <MaterialCommunityIcons name="chevron-left" size={20} color="#000" />
    </TouchableOpacity>
    <Text style={styles.barLabel}>{label}</Text>
    <TouchableOpacity onPress={onNext} style={styles.navBtn}>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#000" />
    </TouchableOpacity>
  </View>
);

const StudentAttendance = () => {
  const navigation = useNavigation();
  const { userData } = useAuth();



  // Single month state for all three components
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(userData);
    const fetchAnnouncements = async () => {
      if (!userData?._id) {

        setError('User ID not found');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`https://quantumflux.in:5001/user/${userData._id}/attendance`);
        if (!res.ok) throw new Error('Failed to fetch attendance');
        const data = await res.json();
        setAttendanceData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [userData]);

  // Function to check if we can navigate to next month
  const canNavigateToNextMonth = (monthMoment) => {
    const nextMonth = moment(monthMoment).add(1, 'month');
    const currentDate = moment();

    // Allow navigation if next month is current month or before current month
    return nextMonth.isSameOrBefore(currentDate, 'month');
  };

  // Navigation handlers that update all components at once
  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => moment(prev).subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    if (canNavigateToNextMonth(currentMonth)) {
      setCurrentMonth((prev) => moment(prev).add(1, 'month'));
    }
  };
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

      // ✅ Only till today’s date
      if (dateObj.isSameOrBefore(currentDate, 'day')) {
        if (records.length > 0) {
          const attendanceStatus = records[0].present;
          if (attendanceStatus === true) {
            status = 'Present';
          } else if (attendanceStatus === false) {
            status = 'Absent';
          }
        }
      }

      // ❌ Ignore Holidays completely (status=null means skip)
      if (status) {
        days.push({
          date: d,
          status,
          _id: dayKey,
        });
      }
    }
    return days;
  };

  // Using same month for all components
  const calendarAttendance = getMonthAttendanceDays(currentMonth);

  // Donut chart - only count past and current dates
  const chartAttendance = getMonthAttendanceDays(currentMonth).filter(day => !day.isFuture);
  const presentCount = chartAttendance.filter((d) => d.status === 'Present').length;
  const absentCount = chartAttendance.filter((d) => d.status === 'Absent').length;
  const totalCount = presentCount + absentCount;
  const presentPct = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
  const absentPct = totalCount > 0 ? Math.round((absentCount / totalCount) * 100) : 0;

  const chartData = [
    { key: 'Present', value: presentCount, svg: { fill: '#00cc00' }, label: 'Present' },
    { key: 'Absent', value: absentCount, svg: { fill: '#ff0000' }, label: 'Absent' },
  ];

  // Table - only show past and current dates
  const tableAttendance = getMonthAttendanceDays(currentMonth).filter(day => !day.isFuture);

  const renderCalendarGrid = () => {
    const start = moment(currentMonth).startOf('month');
    const startDay = start.day();
    const total = currentMonth.daysInMonth();
    const cells = Math.ceil((startDay + total) / 7) * 7;
    const days = [];

    for (let i = 0; i < cells; i++) {
      const day = i - startDay + 1;
      let borderColor = 'transparent';
      let textColor = '#000';
      let txt = '';

      if (day > 0 && day <= total) {
        const att = calendarAttendance.find((d) => d.date === day);
        txt = `${day}`;

        if (att?.isFuture) {
          textColor = '#ccc';
          borderColor = 'transparent';
        } else {
          if (att?.status === 'Present') {
            borderColor = 'green';
            textColor = 'black';
          } else if (att?.status === 'Absent') {
            borderColor = 'red';
            textColor = 'black';
          } else {
            borderColor = 'transparent';
            textColor = 'black';
          }
        }
      }

      days.push(
        <View key={i} style={styles.dayCell}>
          <Text style={[
            styles.dayText,
            {
              borderBottomWidth: 2,
              borderBottomColor: borderColor,
              color: textColor
            }
          ]}>
            {txt}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.calendarGrid}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <Text key={i} style={styles.dayLabel}>{d}</Text>
        ))}
        {days}
      </View>
    );
  };

  const Labels = ({ slices }) => {
    return slices.map((slice, idx) => {
      const total = slices.reduce((sum, s) => sum + s.data.value, 0);
      const percentage = total > 0 ? Math.round((slice.data.value / total) * 100) : 0;

      const { pieCentroid } = slice;
      const centerX = pieCentroid[0];
      const centerY = pieCentroid[1];
      const scaleFactor = 1.3;
      const adjustedX = centerX * scaleFactor;
      const adjustedY = centerY * scaleFactor;

      return (
        <G key={idx}>
          <Circle
            cx={adjustedX + 1}
            cy={adjustedY + 2}
            r={25}
            fill="rgba(0,0,0,0.1)"
            opacity={0.3}
          />
          <Circle
            cx={adjustedX + 0.5}
            cy={adjustedY + 1}
            r={25}
            fill="rgba(0,0,0,0.05)"
            opacity={0.5}
          />
          <Circle
            cx={adjustedX}
            cy={adjustedY}
            r={25}
            fill="#ffffff"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={0.5}
          />
          <Circle
            cx={adjustedX}
            cy={adjustedY}
            r={24}
            fill="none"
            stroke="rgba(0,0,0,0.03)"
            strokeWidth={1}
          />
          <SVGText
            x={adjustedX}
            y={adjustedY + 1}
            fill="#1f2937"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={12}
            fontWeight="600"
            fontFamily="system-ui"
          >
            {percentage}%
          </SVGText>
        </G>
      );
    });
  };

  const renderTable = () => {
    if (tableAttendance.length === 0) {
      return (
        <View style={styles.card}>
          <CalendarBar
            label={currentMonth.format('MMMM YYYY')}
            onPrev={handlePreviousMonth}
            onNext={handleNextMonth}
          />
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No attendance data for this month</Text>
          </View>
        </View>
      );
    }

    const mid = Math.ceil(tableAttendance.length / 2);
    const left = tableAttendance.slice(0, mid);
    const right = tableAttendance.slice(mid);

    return (
      <View style={styles.card}>
        <CalendarBar
          label={currentMonth.format('MMMM YYYY')}
          onPrev={handlePreviousMonth}
          onNext={handleNextMonth}
        />
        <View style={styles.sideBySide}>
          <View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHead}>Status</Text>
              <Text style={styles.tableHead}>Date</Text>
            </View>
            {left.map(({ _id, date, status }) => (
              <View style={styles.tableRow} key={`l-${_id}`}>
                <Text
                  style={[
                    styles.cell,
                    { color: status === 'Present' ? 'green' : status === 'Absent' ? 'red' : 'black' }
                  ]}
                >
                  {status}
                </Text>
                <Text style={styles.cell}>{date}</Text>
              </View>
            ))}

          </View>
          <View style={styles.verticalDivider} />
          <View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHead}>Date</Text>
              <Text style={styles.tableHead}>Status</Text>
            </View>
            {right.map(({ _id, date, status }) => (
              <View style={styles.tableRow} key={`r-${_id}`}>
                <Text style={styles.cell}>{date}</Text>
                <Text style={[
                  styles.cell,
                  {
                    color: status === 'Present' ? 'green' :
                      status === 'Absent' ? 'red' : 'black'
                  }
                ]}>{status || 'Holiday'}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Header
        title="Attendance"
        onMenuPress={() => navigation.openDrawer()}
        onPortalPress={() => navigation.navigate('AnnouncementScreen')}
      />
      <Text style={styles.attendanceHeading}>Attendance</Text>

      {/* Calendar View */}
      <View style={styles.card}>
        <CalendarBar
          label={currentMonth.format('MMMM YYYY')}
          onPrev={handlePreviousMonth}
          onNext={handleNextMonth}
        />
        {renderCalendarGrid()}
      </View>

      {/* Donut Chart */}
      <View style={styles.card}>
        <CalendarBar
          label={currentMonth.format('MMMM YYYY')}
          onPrev={handlePreviousMonth}
          onNext={handleNextMonth}
        />
        {totalCount > 0 ? (
          <>
            <DonutChart style={{ height: 250, margin: 10 }} data={chartData} innerRadius="50%" outerRadius="75%" labelRadius="90%">
              <Labels />
            </DonutChart>
            <View style={styles.legend}>
              {chartData.map((item, i) => {
                const pct = item.key === 'Present' ? presentPct : absentPct;

                return (
                  <View key={i} style={styles.legendRow}>
                    <View style={styles.legendLeft}>
                      <View style={[styles.legendDot, { backgroundColor: item.svg.fill }]} />
                      <Text style={styles.legendLabel}>{item.label}</Text>
                    </View>
                    <Text style={styles.legendCount}>{item.value}</Text>
                    <Text style={styles.legendValue}>{pct}%</Text>
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No attendance data for this month</Text>
          </View>
        )}
      </View>

      {/* Attendance Table */}
      {renderTable()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5' },
  attendanceHeading: { fontSize: 18, fontWeight: '700', marginVertical: 10, marginLeft: 20 },
  card: {
    backgroundColor: '#fdfcfe',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  calendarBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#d42222',
    paddingVertical: 8,
  },
  navBtn: {
    width: 35,
    height: 35,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FB344B',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  barLabel: {
    fontWeight: '700',
    fontSize: 15,
    color: '#020202',
    flex: 1,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  dayLabel: { width: '14.28%', textAlign: 'center', fontWeight: '600', color: '#000' },
  dayCell: { width: '14.28%', paddingVertical: 8, alignItems: 'center' },
  dayText: { fontSize: 14 },
  legend: { marginTop: 10, paddingHorizontal: 10, paddingVertical: 0 },
  legendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  legendLeft: { flexDirection: 'row', alignItems: 'center', flex: 1.4 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendLabel: { fontSize: 14, color: '#000' },
  legendCount: { flex: 0.6, textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#000' },
  legendValue: { flex: 0.6, textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#000' },

  noDataContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },

  tableRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, width: 140 },
  tableHead: { fontWeight: '700', fontSize: 14, color: '#000' },
  cell: { fontSize: 14 },
  sideBySide: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginTop: 10 },
  verticalDivider: { width: 1, backgroundColor: '#823bac', marginHorizontal: 5, height: '80%', alignSelf: 'center' },
});

export default StudentAttendance;