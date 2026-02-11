import React from 'react';
import { BellIcon, MagnifyingGlassIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const DentistHeader = ({ activeTab, userData }) => {
    const user = userData || { name: 'Dentist User' };

    const getHeaderInfo = () => {
        switch (activeTab) {
            case 'home': return { title: `Welcome, Dr. ${user.name}!`, subtitle: 'Your practice dashboard' };
            case 'patients': return { title: 'My Patients', subtitle: 'Manage all your patients' };
            case 'slots': return { title: 'Add Time Slots', subtitle: 'Schedule your availability' };
            default: return { title: 'Dentist Dashboard', subtitle: 'Manage your dental practice' };
        }
    };

    const headerInfo = getHeaderInfo();

    return (
        <div className="bg-white border-b border-emerald-100 p-4 flex justify-between items-center">
            <div className="flex-1">
                <h2 className="text-[16px] lg:text-2xl font-bold text-emerald-900">{headerInfo.title}</h2>
                <p className="text-emerald-600 mt-1">{headerInfo.subtitle}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden lg:flex">
                    <MagnifyingGlassIcon className="w-5 h-5 text-emerald-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search patients, appointments..."
                        className="pl-10 pr-4 py-2 w-64 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-900 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>

                <button className="hidden lg:flex p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl">
                    <QuestionMarkCircleIcon className="w-6 h-6" />
                </button>

                <button className="hidden lg:flex relative p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        5
                    </span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right hidden lg:block">
                        <p className="font-medium text-emerald-900">Dr. {user.name}</p>
                        <p className="text-sm text-emerald-600">Dentist</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DentistHeader;