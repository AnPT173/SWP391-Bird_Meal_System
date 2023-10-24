import axios from 'axios';

// ----------------------------------------------------------------------

 const BASE_URL = 'http://localhost:8080/api';
// const axiosInstance = axios.create();
 const axiosInstance = axios.create({ baseURL: BASE_URL });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
