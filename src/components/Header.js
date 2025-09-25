import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
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

  return (
    <LinearGradient colors={gradientColors} style={styles.header}>
      {/* Menu Button (Left) */}
      <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
        <Icon name="menu" size={wp('5.5%')} color="#000" />
      </TouchableOpacity>

      {/* Title Text */}
      <Text style={styles.portalText}>Student Portal</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: hp('6%'),               // responsive status bar space
    paddingHorizontal: wp('4%'),        // left-right padding
    paddingBottom: hp('2.5%'),          // bottom space
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#ec6767ff',
    borderBottomWidth: hp('0.15%'),     // responsive bottom border
  },
  menuButton: {
    padding: wp('2.5%'),                // responsive touch area
    borderRadius: wp('5%'),
    borderWidth: 1,
    borderColor: '#FB344B',
  },
  portalText: {
    fontSize: wp('4.5%'),               // responsive font size
    fontWeight: '600',
    color: '#000',
  },
});

export default Header;
