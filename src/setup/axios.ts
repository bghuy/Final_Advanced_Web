import axios from 'axios';

// Tạo một instance Axios
const axiosClient = axios.create({
  baseURL: 'http://localhost::8080', // Thay bằng URL API của bạn
  timeout: 20000, // Thời gian timeout (tùy chọn)
  withCredentials: true,
});

// Thêm interceptor trước mỗi request để gắn token
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy access_token từ localStorage
    const accessToken = localStorage.getItem('access_token');

    // Nếu có access_token, gắn vào Authorization header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // Xử lý lỗi trước khi request được gửi
    return Promise.reject(error);
  }
);

// Interceptor xử lý response để chỉ trả về `data`
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Trả về chỉ `data` từ response
  },
  (error) => {
    // Xử lý lỗi nếu xảy ra
    if (error.response?.status === 401) {
      console.error('Unauthorized! Please check your access token.');
      // Có thể thêm logic làm mới token hoặc logout
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
