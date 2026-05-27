import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BookSlot = () => {
    const { dentistId } = useParams();
    const [slots, setSlots] = useState([]);

    const fetchSlots = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/bookings/dentist-slots/${dentistId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            setSlots(response.data.data);

        } catch (error) {
            console.log(error.message);
        }
    };

    const bookSlot = async (slotId) => {
        const confirmBooking = window.confirm(
            "Are you sure you want to book this slot?"
        );

        if (!confirmBooking) return;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/bookings/book-slot`,
                { slotId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (response.status === 200) {
                alert("Appointment booked successfully");
                fetchSlots();
            }

        } catch (error) {
            alert(error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">
                Available Slots
            </h2>

            <div className="grid gap-4">
                {slots.map((slot) => (
                    <div
                        key={slot._id}
                        className="bg-white shadow p-4 rounded-xl flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">
                                {new Date(slot.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                })}
                            </p>
                            <p>{slot.start} - {slot.end}</p>
                        </div>

                        <button
                            onClick={() => bookSlot(slot._id)}
                            className="bg-emerald-500 text-white px-4 py-2 rounded-lg"
                        >
                            Book
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookSlot;