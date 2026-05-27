import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/outline";

const DentistAllSlots = () => {
    const [slots, setSlots] = useState([]);

    const fetchSlots = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/slots/dentist-slots`
            );

            setSlots(response.data.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const deleteSlot = async (id) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/api/slots/delete-slot/${id}`
            );

            if (response.status === 200) {
                alert("Slot deleted");
                fetchSlots();
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    return (
        <div className="p-4 min-h-screen bg-gray-50">
            <h2 className="text-2xl font-bold mb-6">My Slots</h2>

            {slots.length === 0 ? (
                <p>No slots added yet</p>
            ) : (
                <div className="grid gap-4">
                    {slots.map((slot) => (
                        <div
                            key={slot._id}
                            className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold">
                                    {new Date(slot.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long'
                                    })}
                                </p>
                                <p className="text-gray-600">
                                    {slot.start} - {slot.end}
                                </p>
                            </div>

                            <button
                                onClick={() => deleteSlot(slot._id)}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DentistAllSlots;