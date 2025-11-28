import { updateAccessToken } from "../../redux/slice/authSlice"
import axiosInstance from "./axiosInstance"

const setupAxios = (store) => {
  console.log("axios is working")
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

  axiosInstance.interceptors.response.use(

    (response) => response,
    async (error) => {
      const originalRequest = error.config
      console.log(originalRequest)
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
      }
      try {
        console.log("response is working in axios")
        const response = await axiosInstance.post('/auth/refresh-token')
        const { accessToken } = response.data
        store.dispatch(updateAccessToken(accessToken));
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return axiosInstance(originalRequest)
      } catch (error) {
        console.log("refreshtoken error : ", error)
        window.location.href('/admin')
        return Promise.reject(error)
      }
    }
  )
}
export default setupAxios