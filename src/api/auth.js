import axios from 'axios';

export const loginUser = async (mobile) => {
  try {
    const response = await axios.post('https://quantumflux.in:5001/auth/login/request', {
      mobile, // assuming the API expects `mobile` field
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};
