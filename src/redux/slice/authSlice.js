
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const loginUser = createAsyncThunk (
  'auth/login',
  async (userData,{rejectWithValue}) =>{
   try {
    const response = await axiosInstance.post('/auth/login',userData)
    return response.data
   } catch (error) {
    console.log(error)
   const errorMessage = error.response?.data?.message || "Login failed";
   return rejectWithValue(errorMessage);
   }
  }
)
const storedToken = localStorage.getItem("accessToken")
const storedRole = localStorage.getItem("role")
console.log("stored token : ",storedToken)
const authSlice =createSlice({
  name:"auth",
  initialState:{
    role:null || storedRole ,
    isLoading:false,
    accessToken:storedToken ? storedToken : null,
    isError:null,
  },  
  reducers :{
    setLogout : (state) =>{
     state.role=null,
     state.accessToken=null,
     state.isError=false
     localStorage.removeItem("accessToken")
     localStorage.removeItem("role")
    },
    clearError : (state) =>{
      state.isError =null
    },
    updateAccessToken : (state,action) =>{
      state.accessToken=action.payload
      localStorage.setItem("accessToken",action.payload)
    },
    setCredentials : (state,action) =>{
     state.accessToken = action.payload.accessToken
     state.refreshToken = action.payload.refreshToken
     state.role = action.payload.user.role
    }
  },
  extraReducers : (builder) => {
    builder
    .addCase(loginUser.pending, (state)=> {
      state.isLoading = true
      state.isError = null
    })
    .addCase(loginUser.fulfilled, (state,action) =>{
      state.isLoading=false
      state.role = action.payload.role
      state.accessToken = action.payload.accessToken
      state.isError=null
      localStorage.setItem("accessToken",action.payload.accessToken)
      localStorage.setItem('role',action.payload.role)
    })
    .addCase(loginUser.rejected, (state,action)=>{
      state.isLoading=false
      state.isError=action.payload
    })
  }
  })
  export const {setLogout,clearError,updateAccessToken ,setCredentials } = authSlice.actions
  export default authSlice.reducer