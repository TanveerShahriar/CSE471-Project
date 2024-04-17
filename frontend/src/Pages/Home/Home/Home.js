import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
    const [districts, setDistricts] = useState([]);
    const [error, setError] = useState('');
    const [schedule, setSchedule] = useState([]);
    const fromRef = useRef('');
    const toRef = useRef('');
    const depRef = useRef('');
    const typeRef = useRef('');

    useEffect( () =>{
        fetch("http://localhost:5000/districts")
            .then(res => res.json())
            .then(data => setDistricts(data));
    }, []);

    const handleSearch = async event => {
        event.preventDefault();
        const from = fromRef.current.value;
        const to = toRef.current.value;
        const departure = depRef.current.value;
        const type = typeRef.current.value;

        if (from == to){
            setError("Starting and Destination Can Not be Same")
        } else{
            const url = "http://localhost:5000/search";
            fetch(url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({from, to, departure, type})
            })
            .then(res => res.json())
            .then(data => setSchedule(data));
            event.target.reset();
        }
    }

    return (
        <div>
            <div className='w-2/4 bg-red-500 mx-auto my-10 py-5 rounded'>
                <h1 className='text-white text-center mt-2 text-4xl font-bold'>Search Bus</h1>

                <form onSubmit={handleSearch}>
                    <div className="mb-4">
                        <p className="text-xl text-left text-white font-bold ml-8">From:</p>
                        <select
                            className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                            ref={fromRef}
                        >
                            {
                                districts.map(district => <option key={district._id}>{district.name}</option>)
                            }
                        </select>

                        <p className="text-xl text-left text-white font-bold ml-8">To:</p>
                        <select
                            className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                            ref={toRef}
                        >
                            {
                                districts.map(district => <option key={district._id}>{district.name}</option>)
                            }
                        </select>

                        <p className="text-xl text-left text-white font-bold ml-8">Departure:</p>
                        <input
                            ref={depRef}
                            type="date"
                            id="departureTime"
                            className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                            required
                        />

                        <p className="text-xl text-left text-white font-bold ml-8">Bus Type:</p>
                        <select
                            className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                            ref={typeRef}
                        >
                            <option>AC</option>
                            <option>Non-AC</option>
                        </select>
                    </div> 

                    <p className="text-xl text-white font-bold">{error}</p>

                    <button className="bg-red-400 hover:bg-red-700 text-xl text-white font-bold py-2 px-4 rounded">
                        SEARCH
                    </button>
                </form>
            </div>

            {
                schedule.length === 0 ?
                <div className='w-2/4 bg-red-500 mx-auto my-10 py-5 rounded text-white font-bold text-xl'>
                    No Result To Show
                </div>
                :
                schedule.map(schedule => 
                    <div key={schedule._id} className='w-2/4 bg-red-500 mx-auto my-10 py-5 rounded'>
                        <div className="text-left ml-8 text-white font-bold">
                            <p>Departure Day : {schedule.departureTime.split("T")[0]}</p>
                            <p>Departure Time : {schedule.departureTime.split("T")[1]}</p>
                            <p>Arrival Time : {schedule.arrivalTime.split("T")[1]}</p>
                        </div>
                        <Link to='/test' className="bg-red-400 hover:bg-red-700 text-xl text-white font-bold py-2 px-4 rounded">
                            BOOK TICKET
                        </Link>
                    </div>
                )  
            }
            
        </div>
    );
};

export default Home;