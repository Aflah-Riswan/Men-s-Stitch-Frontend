import { updateAccessToken, setLogout } from "../redux/slice/authSlice"
import axiosInstance from "./axiosInstance"
import { toast } from 'react-hot-toast'

const setupAxios = (store) => {
  console.log("axios interceptors initialized")

  // 1. REQUEST INTERCEPTOR
  axiosInstance.interceptors.request.use(
    (config) => {
      const isAdminRequest = config.url.startsWith('/admin')

      let token;
      if (isAdminRequest) {
        token = localStorage.getItem('adminAccessToken');
      } else {
        token = localStorage.getItem('userAccessToken')
      }

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // 2. RESPONSE INTERCEPTOR
  axiosInstance.interceptors.response.use(
    (response) => {
      // if (response.data?.message && response.config.method !== 'get') {
      //   toast.success(response.data.message);
      // }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const { response } = error;

    
      if (response?.status === 404) {
        return Promise.reject(error);
      }
   
      if (response?.status === 403 && response?.data?.message?.includes('Blocked')) {
        toast.error("Your account has been blocked. Logging out...");
        store.dispatch(setLogout());
        localStorage.removeItem('userAccessToken');
        window.location.href = '/login';
        return ;
      }

      if (response && response.data) {
        const { errorCode, message } = response.data;
        if (response.status !== 401) {
          switch (errorCode) {
            case 'USER_NOT_FOUND':
              toast.error("Account not found. Please check your email.");
              break;
            case 'INVALID_CREDENTIALS':
              toast.error("Incorrect password. Please try again.");
              break;
            case 'VALIDATION_ERROR':
              console.log("message: ", message)
              toast.error(message);
              break;
            case 'USER_ALREADY_EXISTS':
              toast.error("Email is already registered.");
              break;
            default:
              toast.error(message || "Something went wrong");
          }
        }
      }

      // --- CRITICAL FIX: Handle 401 (Unauthorized) ---
      if (response?.status === 401 && !originalRequest._retry) {

        if (originalRequest.url.includes('/login') || originalRequest.url.includes('/auth/login')) {
          return Promise.reject(error);
        }
        
        if (originalRequest.url.includes('/auth/refresh-token')) {
          store.dispatch(setLogout());
          window.location.href = '/login';
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          const isAdminRequest = originalRequest.url.startsWith('/admin')

          // Attempt to get a new token using the HttpOnly cookie
          const res = await axiosInstance.post('/auth/refresh-token');
          const { accessToken } = res.data;

          // Update LocalStorage and Redux
          if (isAdminRequest) {
            localStorage.setItem('adminAccessToken', accessToken);
          } else {
            localStorage.setItem('userAccessToken', accessToken);
          }

          store.dispatch(updateAccessToken(accessToken));

          // Retry the original failed request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);

        } catch (refreshError) {
          // If refresh fails, log the user out completely
          store.dispatch(setLogout());
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupAxios;