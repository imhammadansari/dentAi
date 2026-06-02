import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    CalendarDaysIcon,
    ClockIcon,
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon
} from "@heroicons/react/24/outline";

const DentistAllAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/bookings/dentist-patients`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const bookedAppointments = res.data.data.filter(
                (item) => item.status?.toLowerCase() === "booked"
            );

            setAppointments(bookedAppointments);

        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <div className="p-2 lg:p-4">
            <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                <h3 className="text-xl font-bold text-black mb-6">
                    All Appointments
                </h3>

                <div className="space-y-4">
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                                            <UserCircleIcon className="w-7 h-7 text-white" />
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-black">
                                                {appointment.name}
                                            </h4>

                                            <div className="flex items-center gap-2 text-sm text-emerald-700">
                                                <EnvelopeIcon className="w-4 h-4" />
                                                {appointment.email}
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-emerald-700">
                                                <PhoneIcon className="w-4 h-4" />
                                                {appointment.phone}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="flex items-center gap-2 text-sm text-black">
                                            <CalendarDaysIcon className="w-4 h-4" />
                                            {new Date(appointment.nextAppointment).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long'
                                            })}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-black mt-1">
                                            <ClockIcon className="w-4 h-4" />
                                            {appointment.start} - {appointment.end}
                                        </div>

                                        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm">
                                            {appointment.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-8 text-emerald-600">
                            No Appointments
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DentistAllAppointments;