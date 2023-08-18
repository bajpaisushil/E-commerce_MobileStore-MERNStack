import React from 'react'
import { useNavigate, Outlet } from 'react-router-dom';
import { AdminHeaders, PrimaryButton } from './CommonStyled';

const Orders = () => {
  const nav=useNavigate();
  return (
    <div>
    <AdminHeaders>
      Orders
    </AdminHeaders>
    <Outlet />
    </div>
  )
}

export default Orders;

