import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe('pk_test_51P7M9DLFvLm4gyXrsce78jLXrQWp2etGOsgsKnvNBPpWYWt8v2PZVgNsWXvNbRYclErxTR4lsoVVqxho75nvLos200oWv01t2A');

const SeatStatus = () => {
    const [schedule, setSchedule] = useState([]);
    const [bgColor, setBgColor] = useState({});
    const [yellowSeats, setYellowSeats] = useState([]);
    const { scheduleId } = useParams();

    useEffect( () =>{
        fetch(`http://localhost:5000/schedule/${scheduleId}`)
        .then(res => res.json())
        .then(data => setSchedule(data));
    }, [scheduleId]);

    const handleClick = (seatName) => {
        setBgColor(prevState => ({
            ...prevState,
            [seatName]: prevState[seatName] === 'bg-green-500' ? 'bg-yellow-500' : 'bg-green-500'
        }));

        setYellowSeats(prevSeats => {
            const updatedSeats = bgColor[seatName] === 'bg-green-500' ? [...prevSeats, seatName] : prevSeats.filter(seat => seat !== seatName);
            return updatedSeats;
        });
    };

    return (
        <div className='w-2/4 bg-red-500 mx-auto my-10 p-5 rounded'>
            {
                schedule.seats ?
                <div>
                    <div className="text-white text-3xl font-bold">Schedule Details</div>
                    <div className="my-4 text-white text-xl font-bold">
                        <p>Date : {schedule.departureTime.split("T")[0]}</p>
                        <p>Departure Time : {schedule.departureTime.split("T")[1]}</p>
                        <p>Arrival Time : {schedule.arrivalTime.split("T")[1]}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="grid grid-cols-4">
                            {
                                schedule.seats.map((seat, index) => 
                                    <div className="border-solid border-2" key={index}>
                                        {
                                            seat[Object.keys(seat)[0]] ?
                                            <div className="bg-red-700">{Object.keys(seat)[0]}</div>
                                            :
                                            <div
                                            className={bgColor[Object.keys(seat)[0]] || 'bg-green-500'} // Set initial background color
                                            onClick={() => handleClick(Object.keys(seat)[0])} // Pass seatName to handleClick
                                            >
                                                {Object.keys(seat)[0]}
                                            </div>
                                        }
                                    </div>)
                            }
                        </div>
                        <div className="text-white text-lg font-bold text-left ml-8 p-8 border-solid border-2 "> 
                            <p>Seats : 
                                {
                                    yellowSeats.length === 0 ?
                                    " Select Seat"
                                    :
                                    yellowSeats.join(",")
                                }
                            </p>
                            <p>Price Per Seat : {schedule.price}</p>
                            <p>Total Seats : {yellowSeats.length}</p>
                            <p>Total Price : {schedule.price * yellowSeats.length}</p>
                            <Elements stripe={stripePromise}>
                                <CheckoutForm price = {schedule.price * yellowSeats.length}></CheckoutForm>
                            </Elements>
                        </div>
                    </div>
                </div>
                :
                <p>Loading......</p>
            }
        </div>
    );
};

export default SeatStatus;