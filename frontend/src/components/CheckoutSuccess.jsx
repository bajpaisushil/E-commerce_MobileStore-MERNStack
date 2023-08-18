import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { clearCart, getTotal } from '../features/cartSlice';


const CheckoutSuccess=()=>{
    const dispatch=useDispatch();
    const cart=useSelector(state=> state.cart);
    useEffect(()=>{
        dispatch(clearCart());
    }, [dispatch]);
    useEffect(()=>{
        dispatch(getTotal());
    }, [cart, dispatch]);
    return (
        <Container>
            <h1>Checkout Successful</h1>
            <p>Your order might take some time to process.</p>
            <p>Check your order status at your profile after about 10 mins.</p>
            <p>
                Incase of any inquiries, Contact the support at <strong>support@onlineshop.com</strong>
            </p>
        </Container>
    )
}

export default CheckoutSuccess;

const Container=styled.div`
min-height: 80vh;
max-width: 800px;
width: 100%;
margin: auto;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
h1{
    margin-bottom: 0.5rem;
    color: #029e02;
}
`

