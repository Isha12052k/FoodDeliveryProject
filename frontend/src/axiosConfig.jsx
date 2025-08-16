import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5000/api', // local
  baseURL: 'http://3.25.58.68:5000', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
