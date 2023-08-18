import React from 'react'
import { useNavigate, Outlet } from 'react-router-dom';
import { AdminHeaders, PrimaryButton } from './CommonStyled';

const Products = () => {
  const nav=useNavigate();
  return (
    <div>
    <AdminHeaders>
      Products
      <PrimaryButton onClick={()=> nav("/admin/products/create-product")}>Create</PrimaryButton>
    </AdminHeaders>
    <Outlet />
    </div>
  )
}

export default Products;

