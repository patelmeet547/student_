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
import { Text as SVGText } from 'react-native-svg';
import Header from '../components/Header'; // Ensure correct path to Header component

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
  const [calendarMonth, setCalendarMonth] = useState(moment());
  const [chartMonth, setChartMonth] = useState(moment());
  const [tableMonth, setTableMonth] = useState(moment());
  const [calendarAttendance, setCalendarAttendance] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setCalendarAttendance(generateAttendance(calendarMonth));
  }, [calendarMonth]);

  useEffect(() => {
    generateChartData(chartMonth);
  }, [chartMonth]);

  useEffect(() => {
    generateTable(tableMonth);
  }, [tableMonth]);

  const generateAttendance = (monthMoment) => {
    const days = monthMoment.daysInMonth();
    return Array.from({ length: days }, (_, i) => ({
      date: i + 1,
      status: (i + 1) % 6 === 0 || (i + 1) % 9 === 0 ? 'Absent' : 'Present',
    }));
  };

  const generateChartData = (monthMoment) => {
    const data = generateAttendance(monthMoment);
    const present = data.filter((d) => d.status === 'Present').length;
    const absent = data.filter((d) => d.status === 'Absent').length;
    setChartData([
      { key: 'Present', value: present, svg: { fill: '#00cc00' }, label: 'Present' },
      { key: 'Absent', value: absent, svg: { fill: '#ff0000' }, label: 'Absent' },
    ]);
  };

  const generateTable = (monthMoment) => {
    const data = generateAttendance(monthMoment);
    setTableData(data);
  };

  const renderCalendarGrid = () => {
    const start = moment(calendarMonth).startOf('month');
    const startDay = start.day();
    const total = calendarMonth.daysInMonth();
    const cells = Math.ceil((startDay + total) / 7) * 7;
    const days = [];

    for (let i = 0; i < cells; i++) {
      const day = i - startDay + 1;
      let borderColor = 'transparent';
      let txt = '';
      if (day > 0 && day <= total) {
        const att = calendarAttendance.find((d) => d.date === day);
        if (att?.status === 'Present') borderColor = 'green';
        if (att?.status === 'Absent') borderColor = 'red';
        txt = `${day}`;
      }
      days.push(
        <View key={i} style={styles.dayCell}>
          <Text style={[styles.dayText, { borderBottomWidth: 2, borderBottomColor: borderColor }]}>
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

  const Labels = ({ slices }) =>
    slices.map((slice, idx) => (
      <SVGText
        key={idx}
        x={slice.pieCentroid[0]}
        y={slice.pieCentroid[1]}
        fill="white"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={12}
        stroke="black"
        strokeWidth={0.3}
      >
        {slice.data.value}
      </SVGText>
    ));

  const renderTable = () => {
    const mid = Math.ceil(tableData.length / 2);
    const left = tableData.slice(0, mid);
    const right = tableData.slice(mid);
    return (
      <View style={styles.card}>
        <CalendarBar
          label={tableMonth.format('MMMM YYYY')}
          onPrev={() => setTableMonth((p) => moment(p).subtract(1, 'month'))}
          onNext={() => setTableMonth((p) => moment(p).add(1, 'month'))}
        />
        <View style={styles.sideBySide}>
          <View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHead}>Status</Text>
              <Text style={styles.tableHead}>Date</Text>
            </View>
            {left.map(({ date, status }) => (
              <View style={styles.tableRow} key={`l-${date}`}>
                <Text style={[styles.cell, { color: status === 'Present' ? 'green' : 'red' }]}>
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
            {right.map(({ date, status }) => (
              <View style={styles.tableRow} key={`r-${date}`}>
                <Text style={styles.cell}>{date}</Text>
                <Text style={[styles.cell, { color: status === 'Present' ? 'green' : 'red' }]}>
                  {status}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Fixed Header */}
      <Header
        title="Attendance"
        onMenuPress={() => navigation.openDrawer()}
        onPortalPress={() => navigation.navigate('AnnouncementScreen')} // adjust navigation target
      />

      <Text style={styles.attendanceHeading}>Attendance</Text>

      {/* Calendar View */}
      <View style={styles.card}>
        <CalendarBar
          label={calendarMonth.format('MMMM YYYY')}
          onPrev={() => setCalendarMonth((p) => moment(p).subtract(1, 'month'))}
          onNext={() => setCalendarMonth((p) => moment(p).add(1, 'month'))}
        />
        {renderCalendarGrid()}
      </View>

      {/* Donut Chart */}
      <View style={styles.card}>
        <CalendarBar
          label={chartMonth.format('MMMM YYYY')}
          onPrev={() => setChartMonth((p) => moment(p).subtract(1, 'month'))}
          onNext={() => setChartMonth((p) => moment(p).add(1, 'month'))}
        />
        <DonutChart style={{ height: 180 }} data={chartData} innerRadius="60%" outerRadius="95%" labelRadius="90%">
          <Labels />
        </DonutChart>
        <View style={styles.legend}>
          {chartData.map((item, i) => {
            const total = chartData.reduce((sum, d) => sum + d.value, 0);
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
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
      </View>

      {/* Attendance Table */}
      {renderTable()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 20 },
  attendanceHeading: { fontSize: 18, fontWeight: '700', marginVertical: 10 },
  card: {
    backgroundColor: '#fdfcfe',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
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
    backgroundColor: '#fff',
    paddingVertical: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d42222',
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
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 12,
  },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  dayLabel: { width: '14.2%', textAlign: 'center', fontWeight: '600', color: '#000' },
  dayCell: { width: '14.2%', paddingVertical: 8, alignItems: 'center' },
  dayText: { fontSize: 14, color: '#000' },
  legend: { marginTop: 10, paddingHorizontal: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, justifyContent: 'space-between' },
  legendLeft: { flexDirection: 'row', alignItems: 'center', flex: 1.4 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendLabel: { fontSize: 14, color: '#000' },
  legendCount: { flex: 0.6, textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#000' },
  legendValue: { flex: 0.6, textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#000' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', width: 140, marginBottom: 6 },
  tableHead: { fontWeight: '700', fontSize: 14, color: '#000' },
  cell: { fontSize: 14 },
  sideBySide: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  verticalDivider: { width: 1, backgroundColor: '#823bac', marginHorizontal: 5, height: '80%', alignSelf: 'center' },
});

export default StudentAttendance;
