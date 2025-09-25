import React, { useEffect, useState } from 'react';
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
import { useAuth } from '../context/AuthContext';
import SimpleLoader from './Loading';
import { TouchableOpacity } from 'react-native';


const { width, height } = Dimensions.get('window');

const HomeworkScreen = () => {
  const navigation = useNavigation();
  const { userData } = useAuth();
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomework = async () => {
      if (!userData?.class?._id) {
        setError('User class ID not found');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`https://quantumflux.in:5001/class/${userData.class._id}/homework`);
        if (!res.ok) throw new Error('Failed to fetch homework');
        const data = await res.json();
        setHomeworkList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHomework();
  }, [userData]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <SimpleLoader />

      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header
        onMenuPress={() => navigation.openDrawer()}
        onPortalPress={() => navigation.navigate('LeaveScreen')}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Homework</Text>
        {homeworkList.map(item => (
          <HomeworkCard key={item._id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const HomeworkCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.cardNavbar}>
        <Text style={styles.issuerText}>
          {moment(item.createdAt).format('D MMMM, YYYY')}
        </Text>
      </View>
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      {expanded && (
        <Text style={styles.cardDescription}>
          {/* <Text style={styles.descLabel}>Description: </Text> */}
          {item.description}
        </Text>
      )}
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.readMore}>
          {expanded ? 'Show Less' : 'Click to Read More...'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  readMore: {
    color: '#d42222',
    marginTop: 6,
    fontSize: 13,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.04,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: '700',
    marginBottom: height * 0.02,
    color: '#000',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width * 0.045,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardNavbar: {
    borderBottomWidth: 1,
    borderBottomColor: '#d42222',
    paddingBottom: height * 0.008,
    marginBottom: height * 0.015,
  },
  issuerText: {
    fontStyle: 'italic',
    color: '#838181',
    fontSize: width * 0.034,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.008,
  },
  cardTitle: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#000',
  },
  cardDescription: {
    fontSize: width * 0.038,
    color: '#444',
    lineHeight: 22,
  },
  descLabel: {
    fontWeight: 'bold',
  },
});

export default HomeworkScreen;
