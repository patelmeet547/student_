import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Header = ({
  onMenuPress,
  gradientColors = ['#F7E5FF', '#FDF6FF'],
}) => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.navigate('SidebarScreen');
  };

  const goToDashboard = () => {
    navigation.navigate('StudentDashboard'); 
  };

  return (
    <LinearGradient colors={gradientColors} style={styles.header}>
      <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
        <Icon name="menu" size={wp('5.5%')} color="#000" />
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      <TouchableOpacity onPress={goToDashboard} style={styles.logoContainer}>
        <Image
          source={require('../assets/img/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: hp('6%'),
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('2.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the left
    borderBottomColor: '#ec6767ff',
    borderBottomWidth: hp('0.15%'),
  },
  menuButton: {
    padding: wp('2.5%'),
    borderRadius: wp('5%'),
    borderWidth: 1,
    borderColor: '#FB344B',
  },
  logoContainer: {
    alignItems: 'flex-end', // Align logo to the right
    justifyContent: 'center',
  },
  logo: {
    width: wp('25%'), // Adjust size as needed
    height: hp('5%'),
  },
});

export default Header;
