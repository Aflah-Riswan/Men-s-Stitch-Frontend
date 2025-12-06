import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../src/utils/axiosInstance"

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/products', { params })
    if (response.data.success) return response.data
    else return rejectWithValue(response.data.message)

  } catch (error) {
    console.log("error found in  : ", error)
    return rejectWithValue(error.response?.data?.message || error.message);
  }
})

export const toggleProductList = createAsyncThunk('product/toggleList', async (id, { rejectWithValue }) => {

  try {
    const response = await axiosInstance.patch(`/products/${id}/toggle`)
    console.log('response : ', response.data)
    if (response.data.success) {
      return response.data.updatedData
    }
    else {
      return rejectWithValue(response.data.message)
    }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})


const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    pagination: {},
    isLoading: false,
    isError: null
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.isError = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.products
        state.pagination = action.payload.pagination
        console.log("products : ", action.payload.products)
        console.log('pagination : ', action.payload.pagination)
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoding = false
        state.isError = action.payload
      })
      .addCase(toggleProductList.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(toggleProductList.fulfilled, (state, action) => {
        state.isLoading = false

        const { _id, isListed } = action.payload
        const existingProduct = state.items.find((product) => product._id === _id)
        if (existingProduct) {
          existingProduct.isListed = isListed
        }
      })
      .addCase(toggleProductList.rejected, (state, action) => {
        state.isError = action.payload.message
        state.isLoading = false
      })
  }
})

export const { setLoading, setError } = productSlice.actions
export default productSlice.reducer