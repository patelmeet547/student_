import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const { width } = Dimensions.get('window');

const HomeworkScreen = () => {
  const navigation = useNavigation();

  const homeworkList = [
    {
      id: 1,
      title: 'Raksha Bandhan',
      date: '2025-06-27',
      description:
        'Welcome to Celebrate Rakshabandhan! A day of love, laughter & lifelong bonds – join the festive fun!',
    },
    {
      id: 2,
      title: 'Raksha Bandhan',
      date: '2025-06-24',
      description:
        'Welcome to Celebrate Rakshabandhan! A day of love, laughter & lifelong bonds – join the festive fun!',
    },
    {
      id: 3,
      title: 'Raksha Bandhan',
      date: '2025-06-23',
      description:
        'Welcome to Celebrate Rakshabandhan! A day of love, laughter & lifelong bonds – join the festive fun!',
    },
  ];

  // Split into "Upcoming" (latest item) and "Recent" (rest of items)
  const upcoming = homeworkList.slice(0, 1);
  const recent = homeworkList.slice(1);

  return (
    <View style={styles.screen}>
      <Header
        onMenuPress={() => navigation.openDrawer()}
        onPortalPress={() => navigation.navigate('LeaveScreen')}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Homework</Text>
        {upcoming.map(item => (
          <HomeworkCard key={item.id} item={item} />
        ))}

        {recent.length > 0 && <Text style={styles.subheading}>Recent</Text>}
        {recent.map(item => (
          <HomeworkCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const HomeworkCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardNavbar}>
        <Text style={styles.issuerText}>
          Submit on: {moment(item.date).format('D MMMM, YYYY')}
        </Text>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>

      <Text style={styles.cardDescription}>
        <Text style={styles.descLabel}>Description: </Text>
        {item.description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: width * 0.05, // 5% padding
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: width * 0.06, // ~24px for standard devices
    fontWeight: '700',
    marginBottom: 16,
  },
  subheading: {
    fontSize: width * 0.05,
    fontWeight: '600',
    marginVertical: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width * 0.04, // dynamic padding
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardNavbar: {
    borderBottomWidth: 1,
    borderBottomColor: '#d42222',
    paddingBottom: 6,
    marginBottom: 12,
  },
  issuerText: {
    fontStyle: 'italic',
    color: '#838181',
    fontSize: width * 0.034, // ~13px
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: width * 0.04, // ~16px
    fontWeight: '700',
    color: '#000',
  },
  cardDescription: {
    fontSize: width * 0.035, // ~14px
    color: '#444',
    lineHeight: 20,
  },
  descLabel: {
    fontWeight: 'bold',
  },
});

export default HomeworkScreen;
