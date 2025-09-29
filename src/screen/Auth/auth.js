
import AsyncStorage from '@react-native-async-storage/async-storage';

export const verifyOtp = async (mobile, otp) => {

  const verifyRes = await fetch('https://quantumflux.in:5001/auth/login/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: mobile, otp }),
    credentials: 'include',
  });
  let verifyJson;
  try {
    verifyJson = await verifyRes.clone().json();
  } catch (e) {
    const text = await verifyRes.text();
    console.error('Verify API non-JSON response:', text);
    throw new Error('OTP API Error: ' + text.slice(0, 100));
  }
  if (!verifyRes.ok) {
    throw new Error(verifyJson.message || 'OTP verification failed');
  }


  const userRes = await fetch('https://quantumflux.in:5001/user/me', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  let userJson;
  try {
    userJson = await userRes.clone().json();
  } catch (e) {
    const text = await userRes.text();
    console.error('User API non-JSON response:', text);
    throw new Error('User API Error: ' + text.slice(0, 100));
  }
  if (!userRes.ok) {
    throw new Error('Failed to fetch user data');
  }
  return userJson.user;
};