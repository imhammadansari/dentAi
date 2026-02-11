import React, { useState } from 'react';
import {
    UsersIcon,
    UserGroupIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    ChartBarIcon,
    ClockIcon,
    CalendarDaysIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
    const [timeRange, setTimeRange] = useState('month');

    const stats = [
        { icon: UserGroupIcon, label: 'Total Patients', value: '200', change: '+15%', color: 'bg-gradient-dent' },
        { icon: UsersIcon, label: 'Total Dentists', value: '30', change: '+8%', color: 'bg-gradient-to-br from-primary-500 to-emerald-400' },
        { icon: DocumentTextIcon, label: 'Total Reports', value: '450', change: '+22%', color: 'bg-gradient-to-br from-primary-600 to-green-400' },
    ];

    const recentActivities = [
        { id: 1, user: 'Dr. Hammad Ansari', action: 'added new patient', time: '10 min ago', type: 'dentist' },
        { id: 2, user: 'Dr. Faran Khalil', action: 'uploaded X-Ray', time: '25 min ago', type: 'patient' },
        { id: 3, user: 'Dr. ABC', action: 'completed consultation', time: '1 hour ago', type: 'dentist' },
    ];


    return (
        <div className="p-2 lg:p-4 space-y-6 min-h-full">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold text-primary-900">System Overview</h3>
                    <p className="text-primary-600">Monitor platform performance and statistics</p>
                </div>
                <div className="flex gap-2">
                    {['day', 'week', 'month', 'year'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize ${timeRange === range
                                ? 'bg-gray-500 text-white'
                                : 'bg-gray-50 text-primary-700 hover:bg-primary-100'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-primary-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-primary-600 font-medium">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-primary-900 mt-2">{stat.value}</h3>
                                <div className="flex items-center mt-2">
                                    <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500 mr-1" />
                                    <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
                                    <span className="text-sm text-primary-500 ml-2">this {timeRange}</span>
                                </div>
                            </div>
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className=" gap-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-2xl border border-primary-100 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-bold text-primary-900">Recent Activities</h4>
                        <button className="text-primary-600 hover:text-primary-700 font-medium">
                            View All →
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-4 bg-primary-50/50 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'dentist' ? 'bg-blue-100 text-blue-600' :
                                        activity.type === 'patient' ? 'bg-primary-100 text-primary-600' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                        {activity.type === 'dentist' ? (
                                            <UsersIcon className="w-5 h-5" />
                                        ) : activity.type === 'patient' ? (
                                            <UserGroupIcon className="w-5 h-5" />
                                        ) : (
                                            <ChartBarIcon className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-primary-900">{activity.user}</h5>
                                        <p className="text-sm text-primary-600">{activity.action}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-primary-600">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;