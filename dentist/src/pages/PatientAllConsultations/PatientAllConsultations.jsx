import React, { useEffect, useState } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const PatientAllConsultations = () => {
    const [consultations, setConsultations] = useState([]);
    const [totalVisits, setTotalVisits] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/users/my-consultations`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                setConsultations(res.data.data);
                setTotalVisits(res.data.totalVisits);

            } catch (err) {
                console.log(err.message);
            }
        };


        fetchData();
    }, []);

    return (
        <div className="p-2 lg:p-4">
            <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
                    <h3 className="text-xl font-bold text-emerald-900">Consultation History</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium">All</button>
                        <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium">Upcoming</button>
                        <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium">Completed</button>
                    </div>
                </div>
                <div className="space-y-4">
                    {consultations.map((consultation) => (
                        <div key={consultation.id} className={`p-4 rounded-xl ${consultation.status === 'upcoming'
                            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100'
                            : 'bg-white border border-emerald-100'
                            }`}>
                            <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-4 lg:gap-0">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${consultation.status === 'completed'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-amber-100 text-amber-600'
                                        }`}>
                                        <CalendarDaysIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-900 text-lg">Dr. {consultation.dentist}</h4>
                                        <p className="text-emerald-600">
                                            {new Date(consultation.date).toLocaleDateString()} • {consultation.time}
                                        </p>
                                        {consultation.notes && (
                                            <p className="text-emerald-700 mt-2">{consultation.notes}</p>
                                        )}

                                        <div className="">
                                            <h3 className="text-emerald-900 text-[14px]">
                                                Total Visits: {totalVisits}
                                            </h3>
                                        </div>
                                    </div>

                                </div>

                                <div className="text-right flex items-center justify-center gap-4">
                                    <span className={`px-4 py-2 rounded-full font-medium ${consultation.status === 'completed'
                                        ? 'bg-green-100 text-green-700'
                                        : consultation.status === 'upcoming'
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                                    </span>
                                    <div className="">
                                        {consultation.status === 'upcoming' ? (
                                            <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                                                Chat
                                            </button>
                                        ) : (
                                            <button className="px-6 py-2 border-2 border-emerald-200 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                                                View Details
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PatientAllConsultations;