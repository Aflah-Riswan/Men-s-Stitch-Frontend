import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../src/utils/axiosInstance";


export const fetchCategories = createAsyncThunk('category/fetchAllCategory',async(_, {rejectWithValue})=>{
  try {
    const response = await axiosInstance.get('/categories')
    return  response.data.categories
  } catch (error) {
     return rejectWithValue(error.response?.data?.message || error.message)
  }
})
export const toggleListButton  = createAsyncThunk('category/updateIsLsit',async (id, {rejectWithValue})=>{
  try {
    const response = await  axiosInstance.patch(`/categories/${id}/toggle`)
    return  response.data.updated
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

const categorySlice = createSlice({
  name:'category',
  initialState :{
    items:[],
    isError:null,
    isLoading:false,
  },
  reducers :{
   getCategories :(state)=>{
    return state.items
   }
  },
  extraReducers: (builder)=>{
  builder.
  addCase(fetchCategories.pending,(state)=>{
    state.isLoading = true
  })
  .addCase(fetchCategories.fulfilled,(state,action)=>{
    state.isLoading=false
    state.items = action.payload
  })
  .addCase(fetchCategories.rejected,(state,action)=>{
    state.isError =action.payload
    state.isLoading = false 
  })
  .addCase(toggleListButton.pending,(state)=>{
    state.isLoading = true
  })
  .addCase(toggleListButton.fulfilled,(state,action)=>{
    console.log(action.payload)
    const {_id ,isListed}=action.payload
    const existingCategory = state.items.find((cat)=>cat._id === _id)
    if(existingCategory){
      existingCategory.isListed = isListed
    }
    state.isLoading = false
  })
  .addCase(toggleListButton.rejected,(state,action)=>{
    state.isLoading = false
    state.isError= action.payload
  })
  }
})
export const {getCategories} = categorySlice.actions
export default categorySlice.reducer