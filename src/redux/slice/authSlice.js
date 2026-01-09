import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// 1. Load EVERYTHING from storage, not just one based on URL
const loadStateFromStorage = () => {
  return {
    userAccessToken: localStorage.getItem("userAccessToken"),
    userRole: localStorage.getItem("userRole"),
    adminAccessToken: localStorage.getItem("adminAccessToken"),
    adminRole: localStorage.getItem("adminRole"),
  };
};

const { userAccessToken, userRole, adminAccessToken, adminRole } = loadStateFromStorage();

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', userData)
      return response.data
    } catch (error) {
      console.log(error)
      const errorMessage = error.response?.data?.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    isError: null,
    // 2. Store distinct variables to match RequireAuth
    userAccessToken: userAccessToken || null,
    userRole: userRole || null,
    adminAccessToken: adminAccessToken || null,
    adminRole: adminRole || null,
  },
  reducers: {
    setLogout: (state) => {
      
      const isAdminPage = window.location.pathname.startsWith('/admin');
      
      if (isAdminPage) {
        state.adminAccessToken = null;
        state.adminRole = null;
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRole");
      } else {
        state.userAccessToken = null;
        state.userRole = null;
        localStorage.removeItem("userAccessToken");
        localStorage.removeItem("userRole");
      }
      state.isError = false;
    },
    clearError: (state) => {
      state.isError = null
    },
    
    updateAccessToken: (state, action) => {
      const isAdminPage = window.location.pathname.startsWith('/admin');
      if (isAdminPage) {
        state.adminAccessToken = action.payload;
        localStorage.setItem("adminAccessToken", action.payload);
      } else {
        state.userAccessToken = action.payload;
        localStorage.setItem("userAccessToken", action.payload);
      }
    },
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.isLoading = false;
      state.isError = null;

      if (user.role === 'admin') {
        state.adminAccessToken = accessToken;
        state.adminRole = user.role;
        localStorage.setItem("adminAccessToken", accessToken);
        localStorage.setItem("adminRole", user.role);
      } else {
        state.userAccessToken = accessToken;
        state.userRole = user.role;
        localStorage.setItem("userAccessToken", accessToken);
        localStorage.setItem("userRole", user.role);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.isError = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        
        const { role, accessToken } = action.payload;

        if (role === 'admin') {
            state.adminAccessToken = accessToken;
            state.adminRole = role;
            localStorage.setItem("adminAccessToken", accessToken);
            localStorage.setItem("adminRole", role);
        } else {
            state.userAccessToken = accessToken;
            state.userRole = role;
            localStorage.setItem("userAccessToken", accessToken);
            localStorage.setItem("userRole", role);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = action.payload
      })
  }
})

export const { setLogout, clearError, updateAccessToken, setCredentials } = authSlice.actions
export default authSlice.reducer