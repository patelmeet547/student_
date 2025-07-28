import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const AnnouncementScreen = () => {
  const navigation = useNavigation();

  const announcements = [
    {
      id: 1,
      issuer: 'Lewis Hamilton',
      title: 'Raksha Bandhan',
      date: '2025-06-27',
      description:
        'Welcome to Celebrate Rakshabandhan! A day of love, laughter & lifelong bonds – join the festive fun!',
      status: 'UPCOMING',
    },
    {
      id: 2,
      issuer: 'Lewis Hamilton',
      title: 'Raksha Bandhan',
      date: '2025-06-24',
      description:
        'Welcome to Celebrate Rakshabandhan! A day of love, laughter & lifelong bonds – join the festive fun!',
      status: 'COMPLETED',
    },
    {
      id: 3,
      issuer: 'Lewis Hamilton',
      title: 'Raksha Bandhan',
      date: '2025-06-23',
      description:
        'Welcome to Celebrate Rakshabandhan! A day of love, laughter & lifelong bonds – join the festive fun!',
      status: 'COMPLETED',
    },
  ];

  const upcoming = announcements.filter(item => item.status === 'UPCOMING');
  const recent = announcements.filter(item => item.status === 'COMPLETED');

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />
      <Header onMenuPress={() => navigation.openDrawer()} onPortalPress={()=>navigation.navigate('HomeworkScreen')}/>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Announcements</Text>
        {upcoming.map(item => (
          <AnnouncementCard key={item.id} item={item} />
        ))}

        <Text style={styles.subheading}>Recent</Text>
        {recent.map(item => (
          <AnnouncementCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const AnnouncementCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardNavbar}>
        <Text style={styles.issuerText}>Issued by: {item.issuer}</Text>
        <LinearGradient
          colors={['#EECFFF', '#F2E8FD']}
          style={styles.statusBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </LinearGradient>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.dateText}>
          {' '}
          · {moment(item.date).format('D MMMM, YYYY')}
        </Text>
      </View>

      <Text style={styles.cardDescription}>
        <Text style={styles.descLabel}>Description: </Text>
        {item.description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardNavbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#d42222',
    paddingBottom: 6,
    marginBottom: 12,
  },
  issuerText: {
    fontStyle: 'italic',
    color: '#838181ff',
    fontSize: 13,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#e03333ff',
    fontWeight: '800',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  dateText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  descLabel: {
    fontWeight: 'bold',
  },
});

export default AnnouncementScreen;
