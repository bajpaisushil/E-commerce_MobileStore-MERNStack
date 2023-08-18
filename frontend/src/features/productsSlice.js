import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHeaders, url } from "./api";
import { toast } from "react-toastify";

const initialState = {
  items: [],
  status: null,
  createStatus: null,
  deleteStatus: null,
  editStatus: null,
};
export const productsFetch = createAsyncThunk(
  "products/productsFetch",
  async () => {
    try {
      const response = await axios.get(`${url}/products`);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const productsCreate = createAsyncThunk(
  "products/productsCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/products`,
        values,
        setHeaders()
      );
      return response.data;
    } catch (error) {
      console.log("U can not create product: ", error);
      toast.error(error.response?.data);
    }
  }
);
export const productsEdit = createAsyncThunk(
    "products/productsEdit",
    async (values) => {
      try {
        const response = await axios.put(
          `${url}/products/${values.product._id}`,
          values,
          setHeaders()
        );
        return response.data;
      } catch (error) {
        console.log("U can not update product: ", error);
        toast.error(error.response?.data);
      }
    }
  );
export const productsDelete = createAsyncThunk(
  "products/productsDelete",
  async (id) => {
    try {
      const response = await axios.delete(`${url}/products/${id}`, setHeaders());
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: {
    [productsFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [productsFetch.fulfilled]: (state, action) => {
      state.status = "success";
      state.items = action.payload;
    },
    [productsFetch.rejected]: (state, action) => {
      state.status = "rejected";
    },

    [productsCreate.pending]: (state, action) => {
      state.createStatus = "pending";
    },
    [productsCreate.fulfilled]: (state, action) => {
      state.items.push(action.payload);
      state.createStatus = "success";
      toast.success("Product Created!");
    },
    [productsCreate.rejected]: (state, action) => {
      state.createStatus = "rejected";
    },

    [productsDelete.pending]: (state, action) => {
      state.deleteStatus = "pending";
    },
    [productsDelete.fulfilled]: (state, action) => {
        const newList=state.items.filter((item)=> item._id!==action.payload._id);
        state.items=newList;
      state.deleteStatus = "success";
      toast.error("Product Deleted!");
    },
    [productsDelete.rejected]: (state, action) => {
      state.deleteStatus = "rejected";
    },

    [productsEdit.pending]: (state, action) => {
        state.editStatus = "pending";
      },
      [productsEdit.fulfilled]: (state, action) => {
        const updatedProduct=state.items.map((product)=> 
        product._id===action.payload._id? action.payload: product);
        state.items=updatedProduct;
        state.editStatus = "success";
        toast.info("Product Updated!");
      },
      [productsEdit.rejected]: (state, action) => {
        state.editStatus = "rejected";
      },
  },
});

export default productsSlice.reducer;
