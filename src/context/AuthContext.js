import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const loginStatus = await AsyncStorage.getItem('isLoggedIn');
      const userInfo = await AsyncStorage.getItem('userData');
      
      if (loginStatus === 'true' && userInfo) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(userInfo));
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userInfo) => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('userData', JSON.stringify(userInfo));
      setIsLoggedIn(true);
      setUserData(userInfo);
      // navigation.reset call removed; rely on App.js ternary
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['isLoggedIn', 'userData']);
      setIsLoggedIn(false);
      setUserData(null);
      await checkAuthStatus();
      // navigation.reset call removed; rely on App.js ternary
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  const value = {
    isLoggedIn,
    isLoading,
    userData,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};