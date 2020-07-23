import React, { Fragment  } from 'react'
import axios from 'axios';
import lifecycle from 'react-pure-lifecycle';

let state = [];

const methods = {
    componentDidMount(props) {
        axios.get("/api/rooms/RentHistory").then(res => {
            console.log(res);
            state = res.data;
        });

        // console.log(state);
    }
    
};

function LoadScript(src){
    return new Promise(resolve => {
        const script = document.createElement('script')
        script.src = src
        //document.body.appendChild(script)
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    
    })
}


function payments(){
    //const [state, setstate] = useState('Nehul')

    async function displayRazorpay(){
        const res = await LoadScript("https://checkout.razorpay.com/v1/checkout.js")
        if(!res){
             alert('Razorpay SDK failed to load . Are you online..?')
             return
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("token")
            }
        };

        let data = {}
        data = await axios.post('http://localhost:5000/razorpay', config).then(response => {
            return response.data;

        }).catch(error => {
            console.log(error);
        })
        
        console.log(data);
        // console.log('front end !!!');
        const options = {
            key: "rzp_test_fvrtPHrPNkX4EA", // Enter the Key ID generated from the Dashboard
            amount: data.amount.toString(), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: data.currency,
            name: "Donation",
            description: "thank you for ntg please give us more",
            image: "https://i.ibb.co/KqNwVNP/Capture1.jpg",
            order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            handler: function (response){
                
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature)
            },

            prefill: {
                //name
                "name": data.name,
                "email": data.email,
                "contact": data.contact_number ? (data.contact_number): ("")
            }
            // notes: {
            //     "address": "Razorpay Corporate Office"
            // },
            // theme: {
            //     "color": "#F37254"
            // }
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }
    let rentHistory = state ? (
        state.map(payment =>{ 
            return(
            <div>
                <ul>
                    <li>{payment.payment_id}</li>
                    <li>{payment.order_id}</li>
                    <li>{payment.transaction_date}</li>
                    <li>{payment.amount}</li>
                    <li>{payment.transaction_method}</li>
                </ul>
            </div>
            )
        })
    ) : (
            <div>
                <h3>No Transaction History</h3>
            </div>
    )
    return(
        <Fragment>
        <div className="payments">
            <a onClick={displayRazorpay}> Pay Rent </a>
            <p> {rentHistory} </p>
        </div>
        </Fragment>
    )


};

export default lifecycle(methods)(payments);