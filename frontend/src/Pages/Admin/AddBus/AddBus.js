import { useRef } from "react";

const AddBus = () => {
    const nameRef = useRef('');
    const typeRef = useRef('');
    const seatRef = useRef('');


    const handleAddBus = async event => {
        event.preventDefault();
        const name = nameRef.current.value;
        const type = typeRef.current.value;
        const seat = seatRef.current.value;

        const bus = { name, type, seat };

        const url = "http://localhost:5000/addbus";
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(bus)
        })
            .then(res => res.json())
            .then(data => {
            });
        
        event.target.reset()
    }

    return (
        <div className='w-2/4 bg-red-500 mx-auto my-10 py-5 rounded'>
            <h1 className='text-white text-center mt-2 text-4xl font-bold'>Add Bus</h1>

            <form onSubmit={handleAddBus}>
                <div className="mb-4">
                    <input
                        ref={nameRef}
                        type="text"
                        id="name"
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        placeholder="Enter Bus No"
                        required
                    />

                    <select
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        ref={typeRef}
                    >
                        <option>Select Bus Type</option>
                        <option>AC</option>
                        <option>Non-AC</option>
                    </select>

                    <input
                        ref={seatRef}
                        type="number"
                        id="seat"
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        defaultValue="40"
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

export default AddBus;