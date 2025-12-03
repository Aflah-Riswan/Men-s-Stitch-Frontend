import { updateAccessToken, setLogout } from "../../redux/slice/authSlice" // Make sure to import logoutUser
import axiosInstance from "./axiosInstance"

const setupAxios = (store) => {
  console.log("axios interceptors initialized")

  // --- REQUEST INTERCEPTOR ---
  axiosInstance.interceptors.request.use(
    (config) => {
      const state = store.getState()
      const token = state.auth.accessToken
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // --- RESPONSE INTERCEPTOR ---
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // 🛑 FIX 1: SAFETY CHECK
      // If the error comes from the refresh-token endpoint itself, 
      // STOP immediately. Don't retry. Log out.
      if (originalRequest.url.includes('/auth/refresh-token')) {
        store.dispatch(setLogout()); 
        window.location.href = '/login'; // Redirect to login
        return Promise.reject(error);
      }

      // 🛑 FIX 2: LOGIC PLACEMENT
      // The try-catch MUST be inside this IF block
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        
        try {
          console.log("Attempting to refresh token...")
          const response = await axiosInstance.post('/auth/refresh-token')
          const { accessToken } = response.data
          
          store.dispatch(updateAccessToken(accessToken));
          
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
          
          return axiosInstance(originalRequest)

        } catch (refreshError) {
          console.log("Refresh token failed: ", refreshError)
          
          // Clear Redux state
          store.dispatch(setLogout());
          
          // 🛑 FIX 3: SYNTAX ERROR
          // href is a property, use '=' not '()'
          window.location.href = '/login'; 
          
          return Promise.reject(refreshError)
        }
      }

      // If it's not a 401, just reject the error normally
      return Promise.reject(error)
    }
  )
}

export default setupAxios