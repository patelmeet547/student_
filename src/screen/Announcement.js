import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import SimpleLoader from './Loading';


const AnnouncementScreen = () => {
  const navigation = useNavigation();
  const { userData } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    console.log('userData:', userData); 
    const fetchAnnouncements = async () => {
      if (!userData?.classId) {
        setError('User class ID not found');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`https://quantumflux.in:5001/class/${userData.classId}/announcement`);
        if (!res.ok) throw new Error('Failed to fetch announcements');
        const data = await res.json();
        setAnnouncements(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [userData]);

  if (loading) {
    return (
      <View style={styles.centered}>
        {/* <SimpleLoader /> */}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red', fontSize: 16, textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <Header onMenuPress={() => navigation.openDrawer()} />
      <ScrollView contentContainerStyle={[styles.container, { paddingHorizontal: width * 0.05 }]}>
        <Text style={styles.heading}>Announcements</Text>
        {announcements.map(item => (
          <AnnouncementCard key={item._id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const AnnouncementCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.cardNavbar}>
        <Text style={styles.issuerText}>Issued by: {item.user?.name || 'Unknown'}</Text>
      </View>
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      {expanded && (
        <Text style={styles.cardDescription}>
       
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
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
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
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#d42222',
    paddingBottom: 6,
    marginBottom: 12,
  },
  issuerText: {
    fontStyle: 'italic',
    color: '#838181',
    fontSize: 13,
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
    flex: 1,
    flexWrap: 'wrap',
  },
  cardDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  descLabel: {
    fontWeight: 'bold',
  },
  readMore: {
    color: '#d42222',
    marginTop: 6,
    fontSize: 13,
  },
});

export default AnnouncementScreen;
