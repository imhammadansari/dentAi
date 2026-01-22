import React, { useState } from 'react';
import { CalendarDaysIcon, ClockIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const AddSlots = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [newSlot, setNewSlot] = useState({ startTime: '09:00', endTime: '09:30', maxPatients: 1 });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const generateCalendar = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();

        const calendar = [];
        let day = 1;

        for (let i = 0; i < 6; i++) {
            const week = [];
            for (let j = 0; j < 7; j++) {
                if ((i === 0 && j < firstDay.getDay()) || day > daysInMonth) {
                    week.push(null);
                } else {
                    const date = new Date(currentYear, currentMonth, day);
                    week.push(date);
                    day++;
                }
            }
            calendar.push(week);
        }

        return calendar;
    };

    const addSlot = () => {
        if (newSlot.startTime && newSlot.endTime) {
            const slot = {
                id: Date.now(),
                date: selectedDate.toDateString(),
                startTime: newSlot.startTime,
                endTime: newSlot.endTime,
                maxPatients: newSlot.maxPatients,
                booked: 0,
            };
            setSlots([...slots, slot]);
            setNewSlot({ startTime: '09:00', endTime: '09:30', maxPatients: 1 });
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

    const calendar = generateCalendar();

    return (
        <div className="p-6 min-h-full">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-black">Schedule Management</h3>
                        <p className="text-emerald-600">Add and manage your available time slots</p>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all">
                        Publish Schedule
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-lg font-bold text-black">
                                    {months[currentMonth]} {currentYear}
                                </h4>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
                                        Today
                                    </button>
                                    <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
                                        ←
                                    </button>
                                    <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
                                        →
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {days.map((day) => (
                                        <div key={day} className="text-center text-black font-medium py-2">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1">
                                    {calendar.flat().map((date, idx) => {
                                        if (!date) {
                                            return <div key={idx} className="h-12"></div>;
                                        }

                                        const isToday = date.toDateString() === new Date().toDateString();
                                        const isSelected = date.toDateString() === selectedDate.toDateString();
                                        const hasSlots = slots.some(slot => slot.date === date.toDateString());

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedDate(date)}
                                                className={`
                          h-12 rounded-lg flex flex-col items-center justify-center transition-all
                          ${isToday ? 'bg-emerald-100 border border-emerald-300' : ''}
                          ${isSelected ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-50'}
                        `}
                                            >
                                                <span className={`font-medium ${isSelected ? 'text-white' : 'text-emerald-900'}`}>
                                                    {date.getDate()}
                                                </span>
                                                {hasSlots && (
                                                    <div className="flex gap-1 mt-1">
                                                        {[...Array(3)].map((_, i) => (
                                                            <div key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`}></div>
                                                        ))}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-emerald-50 p-4 rounded-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <CalendarDaysIcon className="w-5 h-5 text-emerald-600" />
                                    <h5 className="font-bold text-emerald-900">
                                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                    </h5>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {['Morning', 'Afternoon', 'Evening', 'Night'].map((shift) => (
                                        <div key={shift} className="text-center p-2 bg-white rounded-lg">
                                            <p className="text-sm text-emerald-600">{shift}</p>
                                            <p className="font-bold text-emerald-900">4 slots</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
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
                                <div>
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
                                </div>
                                <button
                                    onClick={addSlot}
                                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-200 transition-all"
                                >
                                    Add Slot
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
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
                                                        {slot.startTime} - {slot.endTime}
                                                    </p>
                                                    <p className="text-sm text-emerald-600">{slot.maxPatients} max patients</p>
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
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddSlots;