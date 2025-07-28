import { View, Text } from 'react-native'
import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from './src/screen/splashscreen';
import LoginScreen from './src/screen/Auth/Login';
import OTPVerification from './src/screen/Auth/OTPVerification';
import StudentDashboard from './src/screen/StudentDashboard';
import StudentAttendance from './src/screen/StudentAttendance';
import AnnouncementScreen from './src/screen/Announcement';
import HomeworkScreen from './src/screen/Homework';
import LeaveScreen from './src/screen/StudentLeaveScreen';
import SidebarScreen from './src/screen/side';
import OnboardingScreen from './src/screen/OnboardingScreen';
  
const Stack = createNativeStackNavigator()
const App = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="OnboardingScreen" component={OnboardingScreen}/>
            <Stack.Screen name="SplashScreen" component={SplashScreen}/>
            <Stack.Screen name="LoginScreen" component={LoginScreen}/>
            <Stack.Screen name="OTPVerification" component={OTPVerification}/>
            <Stack.Screen name="StudentDashboard" component={StudentDashboard}/>
            <Stack.Screen name="StudentAttendance" component={StudentAttendance}/>
            <Stack.Screen name="AnnouncementScreen" component={AnnouncementScreen}/>
            <Stack.Screen name="HomeworkScreen" component={HomeworkScreen}/>
            <Stack.Screen name="LeaveScreen" component={LeaveScreen}/>
            <Stack.Screen name="SidebarScreen" component={SidebarScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App  