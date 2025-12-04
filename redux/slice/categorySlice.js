import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../src/utils/axiosInstance";


export const fetchCategories = createAsyncThunk('category/fetchAllCategory', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/categories')
    return response.data.categories
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})
export const toggleListButton = createAsyncThunk('category/updateIsLsit', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(`/categories/${id}/toggle`)
    return response.data.updated
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

export const deleteCategory = createAsyncThunk('category/updateIsDeleted', async (id, { rejectWithValue }) => {
  try {
    confirm("Are you sure")
    const response = await axiosInstance.patch(`/categories/${id}/delete`)
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
    isError: null,
    isLoading: false,
  },
  reducers: {
    getCategories: (state) => {
      return state.items
    },
    setParentCategories: (state, action) => {
      const categories = action.payload
      const parents = categories.filter((cat) => cat.parentCategory === null)
      state.parentCategories = parents
    },
    setSubCategories: (state, action) => {
      const selectedCategory = action.payload
      console.log("selected : ",action.payload)
      console.log("parents : ",state.parentCategories)
      const filtered = state.items.filter(
        (cat) => cat.parentCategory === selectedCategory._id
      )
      state.subCategories = filtered
      console.log("filtered : ",filtered)
      
    }
    
  },
  extraReducers: (builder) => {
    builder.
      addCase(fetchCategories.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        console.log(action.payload)
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isError = action.payload
        state.isLoading = false
      })
      .addCase(toggleListButton.pending, (state) => {
        state.isLoading = true
      })
      .addCase(toggleListButton.fulfilled, (state, action) => {
        console.log(action.payload)
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