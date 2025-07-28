import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = ({
  onMenuPress,
  onPortalPress,
  gradientColors = ['#F7E5FF', '#FDF6FF'],
}) => {
  return (
    <LinearGradient colors={gradientColors} style={styles.header}>
      {/* Menu Button (Left) */}
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Icon name="menu" size={22} color="#000" />
      </TouchableOpacity>

      {/* Student Portal Button (Right) */}
      <TouchableOpacity onPress={onPortalPress}>
        <Text style={styles.portalText}>Student Portal</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',  // <-- This pushes them to opposite sides
    borderBottomColor: '#ec6767ff',
    borderBottomWidth: 1,
  },
  menuButton: {
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FB344B',
  },
  portalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

export default Header;
