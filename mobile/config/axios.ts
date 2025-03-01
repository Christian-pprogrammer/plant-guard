import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = Axios.create({
  baseURL: 'https://ed0936bbef624f38e44d9e4714dad90b.serveo.net',
});

axiosInstance.interceptors.request.use(
  async function (config) {
    if (AsyncStorage) {
      const token = await AsyncStorage.getItem('access_token');
      console.log(token)
      config.headers.Authorization = `Bearer ${token}`;
      config.timeout = 300000;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default axiosInstance;
