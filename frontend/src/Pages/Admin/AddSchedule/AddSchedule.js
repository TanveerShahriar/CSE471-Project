import { useEffect, useRef, useState } from "react";

const AddSchedule = () => {
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const depTimeRef = useRef('');
    const arrTimeRef = useRef('');
    const busRef = useRef('');
    const routeRef = useRef('');
    const driverRef = useRef('');
    const priceRef = useRef('');

    useEffect( () =>{
        fetch("http://localhost:5000/buses")
        .then(res => res.json())
        .then(data => setBuses(data));
    }, []);

    useEffect( () =>{
        fetch("http://localhost:5000/routes")
        .then(res => res.json())
        .then(data => setRoutes(data));
    }, []);

    useEffect( () =>{
        fetch("http://localhost:5000/drivers")
        .then(res => res.json())
        .then(data => setDrivers(data));
    }, []);

    const handleScheduleAdd = async event => {
        event.preventDefault();
        const departureTime = depTimeRef.current.value;
        const arrivalTime = arrTimeRef.current.value;
        const busId = buses.filter(bus => bus.name === busRef.current.value)[0]._id;
        const routeId = routes.filter(route => route.route.join(" -> ") === routeRef.current.value)[0]._id;
        const driverId = drivers.filter(driver => driver.name === driverRef.current.value)[0]._id;
        const price = parseInt(priceRef.current.value);

        const schedule = { departureTime, arrivalTime, busId, routeId, driverId, price };

        const url = "http://localhost:5000/addschedule";
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(schedule)
        })
            .then(res => res.json())
            .then(data => {
            });
        
        event.target.reset()
    }
    return (
        <div className='w-2/4 bg-red-500 mx-auto my-10 py-5 rounded'>
            <h1 className='text-white text-center mt-2 text-4xl font-bold'>Add Schedule</h1>

            <form onSubmit={handleScheduleAdd}>
                <div className="mb-4">
                    <input
                        ref={depTimeRef}
                        type="datetime-local"
                        id="departureTime"
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        required
                    />

                    <input
                        ref={arrTimeRef}
                        type="datetime-local"
                        id="arrivalTime"
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        required
                    />

                    <select
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        ref={busRef}
                    >
                        {
                        buses.map(bus => <option key={bus._id}>{bus.name}</option>)
                        }
                    </select>

                    <select
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        ref={routeRef}
                    >
                        {
                        routes.map(route => <option key={route._id}>{route.route.join(" -> ")}</option>)
                        }
                    </select>

                    <select
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        ref={driverRef}
                    >
                        {
                        drivers.map(driver => <option key={driver._id}>{driver.name}</option>)
                        }
                    </select>
        
                    <input
                        ref={priceRef}
                        type="number"
                        id="price"
                        placeholder="Enter Ticket Price"
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        required
                    />
                </div> 

                <button className="bg-red-400 hover:bg-red-700 text-xl text-white font-bold py-2 px-4 rounded">
                    ADD
                </button>
            </form>
        </div>
    );
};

export default AddSchedule;