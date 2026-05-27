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
                    
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6">
                    <div className='flex flex-col gap-10'>
                        <div className="calendar-wrapper">
                            <Calendar onChange={setSelectedDate} value={selectedDate} />
                        </div>


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