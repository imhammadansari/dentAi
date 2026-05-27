import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const PatientBookingsPage = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState("Booked");

    const fetchBookings = async () => {
        try {

            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/bookings/patient-bookings/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            setBookings(response.data.data || []);

        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(
        (b) => b.status?.toLowerCase() === activeTab.toLowerCase()
    );

    const patient = bookings[0]?.patientId;

    return (
        <div className="max-w-5xl mx-auto p-4">

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-black">
                    {patient?.name}
                </h2>

                <p className="text-emerald-600">
                    {patient?.email}
                </p>

                <p className="text-emerald-600">
                    {patient?.phone}
                </p>
            </div>

            {/* Tabs */}

            <div className="flex gap-3 mb-6">

                {
                    ["Booked", "Completed", "Cancelled"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg border transition ${activeTab === tab
                                ? "bg-emerald-500 text-white border-emerald-500"
                                : "bg-white text-black border-emerald-200"
                                }`}
                        >
                            {tab}
                        </button>
                    ))
                }

            </div>

            {/* Bookings */}

            <div className="space-y-4">

                {
                    filteredBookings.map((booking) => (

                        <div
                            key={booking._id}
                            onClick={() =>
                                navigate(
                                    `/dentist-dashboard/booking/${booking._id}`,
                                    {
                                        state: {
                                            bookingId: booking._id,
                                            name: patient?.name,
                                            email: patient?.email,
                                            phone: patient?.phone,
                                            status: booking.status
                                        }
                                    }
                                )
                            }
                            className="bg-white border border-emerald-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition"
                        >

                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="font-semibold text-black">
                                        {booking.date}
                                    </p>

                                    <p className="text-sm text-emerald-600">
                                        {booking.start} - {booking.end}
                                    </p>
                                </div>

                                <div>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                        {booking.status}
                                    </span>
                                </div>

                            </div>

                        </div>
                    ))
                }

            </div>

        </div>
    );
};

export default PatientBookingsPage;