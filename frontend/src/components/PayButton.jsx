import axios from 'axios';
import { useSelector } from 'react-redux';
import { url } from '../features/api';

const PayButton=({cartItems})=>{
    const user=useSelector((state)=> state.auth);
    const handleCheckout=()=>{
        axios.post(`${url}/stripe/create-checkout-session`, {
            cartItems,
            userId: user._id
        })
        .then((res)=> {
            if(res.data.url){
                window.location.href=res.data.url
            }
        }).catch((err)=>{
            console.log(err.message);
        })
    }
    return(
        <div>
            <button onClick={()=> handleCheckout()}>Check Out</button>
        </div>
    )
}

export default PayButton;
