import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

const CheckoutForm = ( { price, scheduleId, seats } ) => {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState('');
    const [success, setSuccess] = useState('');
    const [processing, setProcessing] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [user, setUser] = useState({});

    const userId = Cookies.get('userId');

    useEffect( () => {
        fetch(`http://localhost:5000/userdetails/${userId}`)
        .then(res => res.json())
        .then(data => setUser(data));
    }, [])

    useEffect( () => {
        if (price > 0) {
            fetch("http://localhost:5000/create-payment-intent", {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ price })
            })
                .then(res => res.json())
                .then(data => {
                    if (data?.clientSecret) {
                        setClientSecret(data.clientSecret);
                    }
                });
        }
    }, [price])

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
          }

        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        setCardError(error?.message || '')
        setSuccess('');
        setProcessing(true);

        // confirm card payment
        const { paymentIntent, error: intentError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: user.name,
                        email: user.email
                    },
                },
            },
        );

        if (intentError) {
            setCardError(intentError?.message);
            setProcessing(false);
        }
        else {
            setCardError('');
            setTransactionId(paymentIntent.id);
            setSuccess('Congrats! Your payment is completed.');

            fetch("http://localhost:5000/bookticket", {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ user : user.name, email : user.email, price, scheduleId, transactionId : paymentIntent.id, seats })
            })
                .then(res => res.json())
                .then(data => {});
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className="my-4">
                <CardElement
                    className="font-bold"
                    options={{
                    style: {
                        base: {
                        fontSize: '16px',
                        color: '#ffffff',
                        '::placeholder': {
                            color: '#ffffff',
                        },
                        },
                        invalid: {
                        color: '#9e2146',
                        },
                    },
                    }}
                />
                <button type="submit" disabled={!stripe || !clientSecret} className="my-2 bg-red-400 hover:bg-red-700 text-xl text-white font-bold py-2 px-4 rounded">
                    Pay
                </button>
            </form>

            <div>
                {
                    cardError && <p className='text-white'>{cardError}</p>
                }
                {
                    success && <div className='text-white'>
                        <p>{success}  </p>
                        <p>Your transaction Id: <span className="text-white font-bold">{transactionId}</span> </p>
                    </div>
                }
            </div>
        </div>
    );
};

export default CheckoutForm;