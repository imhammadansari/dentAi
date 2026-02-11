import React, { useState } from 'react';
import { CalendarDaysIcon, ClockIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from "axios";


const AddSlots = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [newSlot, setNewSlot] = useState({ startTime: '09:00', endTime: '09:30', maxPatients: 1 });
    console.log(selectedDate)

    const addSlot = async () => {
        try {
            if (newSlot.startTime && newSlot.endTime) {
                const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/slots/add-slot`, {
                    date: selectedDate.toDateString(),
                    start: newSlot.startTime,
                    end: newSlot.endTime,
                });

                console.log(response.data);

                if (response.status === 200) {
                    alert("Slot added")
                    // setSlots([...slots, response.data.data]);
                    // setNewSlot({ startTime: '09:00', endTime: '09:30', maxPatients: 1 });

                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const removeSlot = (id) => {
        setSlots(slots.filter(slot => slot.id !== id));
    };

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '18:00', '18:30', '19:00', '19:30'
    ];


    return (
        <div className="p-2 lg:p-4 min-h-full">
            <div className="w-full mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-black">Schedule Management</h3>
                        <p className="text-emerald-600">Add and manage your available time slots</p>
                    </div>
                    {/* <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all">
                        Publish Schedule
                    </button> */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6">
                    <div className='flex flex-col gap-10'>
                        <div className="calendar-wrapper">
                            <Calendar onChange={setSelectedDate} value={selectedDate} />
                        </div>

                        {/* <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-lg font-bold text-emerald-900">Today's Slots</h4>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                    {slots.length} slots
                                </span>
                            </div>

                            <div className="space-y-3">
                                {slots.length > 0 ? (
                                    slots.map((slot) => (
                                        <div key={slot.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <ClockIcon className="w-5 h-5 text-emerald-600" />
                                                <div>
                                                    <p className="font-medium text-emerald-900">
                                                        {slot.startTime} - {slot.endTime} - {slot.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${slot.booked === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-100 text-emerald-700'
                                                    }`}>
                                                    {slot.booked === 0 ? 'Available' : `${slot.booked} booked`}
                                                </span>
                                                <button
                                                    onClick={() => removeSlot(slot.id)}
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <CalendarDaysIcon className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                                        <p className="text-emerald-600">No slots added for today</p>
                                        <p className="text-sm text-emerald-500">Add slots using the form above</p>
                                    </div>
                                )}
                            </div>
                        </div> */}

                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                            <h4 className="text-lg font-bold text-black mb-6">Add Time Slot</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-black mb-2">Start Time</label>
                                    <select
                                        value={newSlot.startTime}
                                        onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                                        className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        {timeSlots.map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-2">End Time</label>
                                    <select
                                        value={newSlot.endTime}
                                        onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                                        className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        {timeSlots.map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-black mb-2">Max Patients</label>
                                    <select
                                        value={newSlot.maxPatients}
                                        onChange={(e) => setNewSlot({ ...newSlot, maxPatients: parseInt(e.target.value) })}
                                        className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <option key={num} value={num}>{num} patient{num > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div> */}
                                <button
                                    onClick={addSlot}
                                    className="w-full cursor-pointer py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-200 transition-all"
                                >
                                    Add Slot
                                </button>
                            </div>
                        </div>


                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddSlots;