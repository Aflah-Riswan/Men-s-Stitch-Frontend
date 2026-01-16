import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";


export const fetchCategories = createAsyncThunk('category/fetchAllCategory', async (params, { rejectWithValue }) => {
  try {
    // console.log("params : ",params)
    const response = await axiosInstance.get('/categories',{params})
    // console.log( " response : in thunk : " ,response.data)
    if(response.data.success){
      
       return response.data
    }else{
      rejectWithValue(response.data.message)
    }
    
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})
export const toggleListButton = createAsyncThunk('category/updateIsLsit', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(`/admin/categories/${id}/toggle`)
    return response.data.updated
  } catch (error) {
    // console.log(error)
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

export const deleteCategory = createAsyncThunk('category/updateIsDeleted', async (id, { rejectWithValue }) => {
  try {
    confirm("Are you sure")
    const response = await axiosInstance.patch(`/admin/categories/${id}/delete`)
    if (response.data.success) {
      return response.data.deletedItem
    }
    else return rejectWithValue(response.data.error)
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }

})

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    items: [],
    parentCategories: [],
    subCategories: [],
    pagination:{},
    isError: null,
    isLoading: false,
  },
  reducers: {

    setParentCategories: (state, action) => {
      const categories = action.payload
      const parents = categories.filter((cat) => cat.parentCategory === null)
      state.parentCategories = parents
    },
    setSubCategories: (state, action) => {
      const selectedCategory = action.payload
  
      const filtered = state.items.filter(
        (cat) => cat.parentCategory === selectedCategory._id
      )
      state.subCategories = filtered
      // console.log("filtered : ",filtered)
      
    }
    
  },
  extraReducers: (builder) => {
    builder.
      addCase(fetchCategories.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        const { categories,pagination } = action.payload
        // console.log("payload : ",action.payload)
        state.isLoading = false
        state.items =categories
        state.pagination = pagination
        
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isError = action.payload
        state.isLoading = false
      })
      .addCase(toggleListButton.pending, (state) => {
        state.isLoading = true
      })
      .addCase(toggleListButton.fulfilled, (state, action) => {
       // console.log(action.payload)
        const { _id, isListed } = action.payload
        const existingCategory = state.items.find((cat) => cat._id === _id)
        if (existingCategory) {
          existingCategory.isListed = isListed
        }
        state.isLoading = false
      })
      .addCase(toggleListButton.rejected, (state, action) => {
        state.isLoading = false
        state.isError = action.payload
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const { _id, isDeleted } = action.payload
        const existingCategory = state.items.find((cat) => cat._id === _id)
        if (existingCategory) existingCategory.isDeleted = isDeleted
        state.isLoading = false
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isError = action.payload
        state.isLoading = false
      })

  }
})
export const { getCategories, setParentCategories, setSubCategories } = categorySlice.actions
export default categorySlice.reducer