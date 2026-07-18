import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
];

const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

const isPastTime = (time, date) => {
    if (!isToday(date)) return false;
    return time <= getCurrentTime();
};

const AddSlots = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [newSlot, setNewSlot] = useState({ startTime: '09:00', endTime: '09:30' });
    const [existingSlots, setExistingSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchExistingSlotsForDate(selectedDate);
    }, [selectedDate]);

    const toLocalDateString = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const fetchExistingSlotsForDate = async (date) => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/slots/dentist-slots`,
                { withCredentials: true }
            );

            const allSlots = res.data.data || [];
            const selectedDateStr = toLocalDateString(date);

            const slotsForDate = allSlots.filter(s => {
                const slotDate = new Date(s.date).toISOString().split('T')[0];
                return slotDate === selectedDateStr;
            });

            setExistingSlots(slotsForDate);
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isStartTimeTaken = (time) => existingSlots.some(s => s.start === time);
    const isTimeOverlapping = (time) => existingSlots.some(s => time > s.start && time <= s.end);

    const isStartDisabled = (time) => isStartTimeTaken(time) || isPastTime(time, selectedDate);
    const isEndDisabled = (time) => {
        if (time <= newSlot.startTime) return true;
        if (isPastTime(time, selectedDate)) return true;
        return isTimeOverlapping(time);
    };

    // Disable past dates on calendar
    const tileDisabled = ({ date }) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const addSlot = async () => {
        if (!newSlot.startTime || !newSlot.endTime) return;
        if (newSlot.endTime <= newSlot.startTime) {
            toast.error('End time must be after start time');
            return;
        }
        if (isStartTimeTaken(newSlot.startTime)) {
            toast.error('This start time is already added for the selected date');
            return;
        }
        if (isPastTime(newSlot.startTime, selectedDate)) {
            toast.error('Cannot add a slot in the past');
            return;
        }

        setAdding(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/slots/add-slot`,
                {
                    date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
                    start: newSlot.startTime,
                    end: newSlot.endTime,
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                toast.success('Slot added successfully!');
                fetchExistingSlotsForDate(selectedDate);
                const nextAvailable = timeSlots.find(t => !isStartTimeTaken(t) && t > newSlot.startTime);
                setNewSlot({ startTime: nextAvailable || timeSlots[0], endTime: '09:30' });
            }
        } catch (error) {
            toast.error(error.response?.data || error.message);
        } finally {
            setAdding(false);
        }
    };

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
                    <div className="flex flex-col gap-6">
                        <div className="calendar-wrapper">
                            <Calendar
                                onChange={setSelectedDate}
                                value={selectedDate}
                                tileDisabled={tileDisabled}
                            />
                        </div>

                        <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm lg:mt-16">
                            <h4 className="text-base font-bold text-black mb-3">
                                Slots for{' '}
                                {selectedDate.toLocaleDateString('en-US', {
                                    weekday: 'short', month: 'short', day: 'numeric'
                                })}
                            </h4>
                            {loading ? (
                                <p className="text-emerald-500 text-sm">Loading...</p>
                            ) : existingSlots.length === 0 ? (
                                <p className="text-emerald-500 text-sm">No slots added yet for this date.</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {existingSlots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-100"
                                        >
                                            <CheckCircleIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            <span className="text-sm text-emerald-800 font-medium">
                                                {slot.start} – {slot.end}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                            <h4 className="text-lg font-bold text-black mb-6">Add Time Slot</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-black mb-2">Start Time</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {timeSlots.map((time) => {
                                            const taken = isStartDisabled(time);
                                            const past = isPastTime(time, selectedDate);
                                            const selected = newSlot.startTime === time;
                                            return (
                                                <button
                                                    key={time}
                                                    disabled={taken}
                                                    onClick={() => setNewSlot({ ...newSlot, startTime: time })}
                                                    className={`py-2 px-1 cursor-pointer rounded-lg text-sm font-medium transition-all border ${past
                                                        ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through'
                                                        : taken
                                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                                                            : selected
                                                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                                                                : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black mb-2">End Time</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {timeSlots.map((time) => {
                                            const disabled = isEndDisabled(time);
                                            const selected = newSlot.endTime === time;
                                            return (
                                                <button
                                                    key={time}
                                                    disabled={disabled}
                                                    onClick={() => setNewSlot({ ...newSlot, endTime: time })}
                                                    className={`py-2 px-1 cursor-pointer rounded-lg text-sm font-medium transition-all border ${disabled
                                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                        : selected
                                                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                                                            : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {newSlot.startTime && newSlot.endTime && newSlot.endTime > newSlot.startTime && !isStartDisabled(newSlot.startTime) && (
                                    <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <ClockIcon className="w-4 h-4 text-emerald-500" />
                                        <span className="text-emerald-800 text-sm font-medium">
                                            Slot: {newSlot.startTime} – {newSlot.endTime} on{' '}
                                            {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                )}

                                <button
                                    onClick={addSlot}
                                    disabled={adding || isStartDisabled(newSlot.startTime) || newSlot.endTime <= newSlot.startTime}
                                    className="w-full cursor-pointer py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {adding ? 'Adding...' : 'Add Slot'}
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