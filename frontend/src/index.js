import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import productsReducer, { productsFetch } from './features/productsSlice';
import { productsApi } from './features/productsApi';
import cartReducer, {getTotal} from './features/cartSlice';
import authReducer, { loadUser } from './features/authSlice';
import ordersSlice from './features/ordersSlice';
import usersSlice from './features/usersSlice';

const store=configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersSlice,
    users: usersSlice,
    cart: cartReducer,
    auth: authReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware)=>
    getDefaultMiddleware().concat(productsApi.middleware)
  
})
store.dispatch(productsFetch());
store.dispatch(getTotal());
store.dispatch(loadUser(null));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
);

