import { useEffect, useRef, useState } from "react";

const AddRoute = () => {
    const [districts, setDistricts] = useState([]);
    const [addedDistricts, setAddedDistricts] = useState([]);
    const districtRef = useRef('');

    const getDistrict = () => {
        fetch("http://localhost:5000/districts")
        .then(res => res.json())
        .then(data => setDistricts(data));
    };

    useEffect( () =>{
        getDistrict();
    }, []);

    console.log(districts);

    const handlePlus = async event => {
        const districtVal = districtRef.current.value;

        const updatedDistricts = districts.filter(district => district.name !== districtVal);
        setDistricts(updatedDistricts);

        setAddedDistricts(prevDistricts => [...prevDistricts, districtVal]);
    }

    const handleAdd = async event => {
        const url = "http://localhost:5000/addroute";
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(addedDistricts)
        })
            .then(res => res.json())
            .then(data => {
            });
        
        setAddedDistricts([]);
        getDistrict();
    }

    return (
        <div className='w-2/4 bg-red-500 mx-auto my-10 py-5 rounded'>
            <h1 className='text-white text-center mt-2 text-4xl font-bold'>Add Route</h1>

            <div className="mb-4">
                <select
                    className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                    ref={districtRef}
                >
                    {
                        districts.map(district => <option>{district.name}</option>)
                    }
                </select>
            </div> 

            <button onClick={handlePlus} className="bg-red-400 hover:bg-red-700 text-xl text-white font-bold py-2 px-4 rounded">
                Plus
            </button>
            <button onClick={handleAdd} className="bg-red-400 hover:bg-red-700 text-xl text-white font-bold ml-6 py-2 px-4 rounded">
                ADD
            </button>
        </div>
    );
};

export default AddRoute;