import React, { useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";

const PatientDetailPage = () => {
    const { state } = useLocation();
    const bookingId = state?.bookingId;
    const [status, setStatus] = useState(state?.status || "Booked");
    const [review, setReview] = useState("");

    const updateStatus = async (newStatus) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_SERVER_URL}/api/bookings/update-status/${bookingId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            setStatus(newStatus); // ✅ update dropdown instantly
        } catch (error) {
            console.log(error.message);
        }
    };

    const submitReview = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/bookings/${bookingId}/review`,
                { review },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            alert("Review submitted!");
            setReview("");
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-3">

            <h2 className="text-xl font-bold">{state?.name}</h2>

            <div className="mt-3 bg-white border rounded-lg p-3 text-sm">
                <p><b>Email:</b> {state?.email}</p>
                <p><b>Phone:</b> {state?.phone}</p>
            </div>

            <div className="mt-3 bg-white border rounded-lg p-3">
                <p className="font-semibold mb-2">Appointment Status</p>
                <select
                    value={status}
                    onChange={(e) => updateStatus(e.target.value)}
                    className="w-full py-2 px-3 border border-emerald-200 rounded-lg"
                >
                    <option value="Booked">Booked</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {/* <div className="mt-3 bg-white border rounded-lg p-3">
                <p className="font-semibold mb-2">Add Review</p>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                    placeholder="Write feedback..."
                    rows={3}
                />
                <button
                    onClick={submitReview}
                    className="mt-2 bg-emerald-500 text-white px-4 py-2 rounded-md text-sm"
                >
                    Submit Review
                </button>
            </div> */}

        </div>
    );
};

export default PatientDetailPage;