import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { setHeaders, url } from '../../features/api';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cartSlice';


function Product() {
    const params=useParams();
    const dispatch=useDispatch();
    const nav=useNavigate();
    const [product, setProduct]=useState({});
    const [loading, setLoading]=useState(false);

    useEffect(()=>{
        async function fetchData(){
            setLoading(true);
          try {
            const res=await axios.get(`${url}/products/find/${params.id}`, setHeaders());
            setProduct(res.data);
          } catch (error) {
            console.log(error);
          }
          setLoading(false);
        }
        fetchData();
      }, [])

      const handleAddToCart=(product)=>{
        dispatch(addToCart(product));
        nav("/cart");
      }
  return (
    <StyledProduct>
        <ProductContainer>
            {loading? (
                <p>Loading...</p>
            ): (
                <div>
                    <ImageContainer>
                        <img src={product?.image?.url} alt='product' />
                    </ImageContainer>
                    <ProductDetails>
                        <h3>{product.name}</h3>
                        <p><span>Brand: </span>{product.brand}</p>
                        <p><span>Descriptionn: </span>{product.desc}</p>
                        <Price>${product.price?.toLocaleString()}</Price>
                        <button className='product-add-to-cart' onClick={()=> handleAddToCart(product)}>Add To Cart</button>
                    </ProductDetails>
                </div>
            )}
        </ProductContainer>
    </StyledProduct>
  )
}

export default Product;

const StyledProduct=styled.div`
margin: 3rem;
display: flex;
justify-content: center;
`
const ProductContainer=styled.div`
max-width: 500px;
width: 100%;
height: auto;
display: flex;
box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
border-radius: 5px;
padding: 2rem;
`
const ImageContainer=styled.div`
flex: 1;
img{
    width: 100%;
}
`
const ProductDetails=styled.div`
flex: 2;
margin-left: 2rem;
h3{
    font-size: 35px;
}
p span{
    font-weight: bold;
}
`
const Price=styled.div`
margin: 1rem 0;
font-weight: bold;
font-size: 25px;
`

