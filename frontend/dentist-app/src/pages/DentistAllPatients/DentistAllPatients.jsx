import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    UserCircleIcon,
    PhoneIcon,
    EnvelopeIcon,
    CalendarDaysIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const DentistAllPatients = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [patients, setPatients] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const navigate = useNavigate();

    const fetchPatients = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/bookings/dentist-patients`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = response.data?.data || response.data?.patients || [];

            setPatients(data);

            console.log(response.data?.patients, "Data")

            const upcoming = data.filter(
                (item) => item.status?.toLowerCase() === "booked"
            );

            setUpcomingAppointments(upcoming);

        } catch (error) {
            console.log(error.message);
            setPatients([]);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(patient => {
        const name = patient?.name || "";
        const email = patient?.email || "";

        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus === 'all' || patient?.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const statusCounts = patients.reduce((acc, patient) => {
        const status = patient?.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const updateStatus = async (bookingId, status) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_SERVER_URL}/api/bookings/update-status/${bookingId}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            fetchPatients();

        } catch (error) {
            console.log(error.message);
        }
    };


    return (
        <div className="lg:p-4 min-h-full">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-black">My Patients</h3>
                        <p className="text-emerald-600">Manage and view patient records and history</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                        <p className="text-emerald-600 font-medium">Total Patients</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                            {patients.length}
                        </h3>
                    </div>

                    <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                        <p className="text-emerald-600 font-medium">Active Patients</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                            {statusCounts.active || 0}
                        </h3>
                    </div>

                    <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                        <p className="text-emerald-600 font-medium">Avg. Sessions</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                            {patients.length
                                ? (patients.reduce((sum, p) => sum + (p.totalVisits || 0), 0) / patients.length).toFixed(1)
                                : 0}
                        </h3>
                    </div>

                    <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                        <p className="text-emerald-600 font-medium">Upcoming Appointments</p>
                        <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                            {setUpcomingAppointments.length}
                        </h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <MagnifyingGlassIcon className="w-5 h-5 text-black absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search patients by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="relative">
                                <FunnelIcon className="w-5 h-5 text-black absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-10 pr-8 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                                >
                                    <option value="all">All Patients</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <button
                                onClick={fetchPatients}
                                className="px-4 py-3 cursor-pointer bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                                <ArrowPathIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPatients.map((patient) => (
                        <div
                            key={patient.id}
                            className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-6 border-b border-emerald-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center">
                                            <UserCircleIcon className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-black">{patient.name}</h4>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-emerald-600">Total Sessions</p>
                                        <p className="text-xl font-bold text-black">
                                            {patient.totalVisits || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() =>
                                    navigate(`/dentist-dashboard/patient/${patient.id}`)
                                }
                                className="cursor-pointer bg-white rounded-2xl border border-emerald-100 shadow-sm p-4 hover:shadow-md transition"
                            >
                                <h4 className="font-bold text-black">{patient.name}</h4>
                                <p className="text-emerald-600 text-sm">{patient.email}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPatients.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserCircleIcon className="w-12 h-12 text-emerald-400" />
                        </div>
                        <h4 className="text-xl font-bold text-emerald-900 mb-2">No patients found</h4>
                        <p className="text-emerald-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DentistAllPatients;