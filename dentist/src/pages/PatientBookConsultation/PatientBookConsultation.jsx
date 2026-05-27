import React, { useEffect, useState } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const PatientBookConsultation = () => {

  const [dentists, setDentists] = useState([]);
  const navigate = useNavigate();

  const getDentists = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/dentists/get-dentists`);

      if (response.status === 200) {
        setDentists(response.data.data);
        // console.log(response.data.data);
      }

    } catch (error) {
      console.log(error.message)

    }
  }

  useEffect(() => {
    getDentists();
  }, []);

  return (
    <div className="p-6 w-full mx-auto">
      <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl border border-emerald-100 p-8 shadow-sm">
        <h3 className="text-2xl font-bold text-emerald-900 mb-2">Book Online Consultation</h3>
        <p className="text-emerald-600 mb-8">Schedule a virtual appointment with our dental specialists</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dentists?.map((dentist, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-emerald-900 text-lg">{dentist.name}</h4>
                  <p className="text-emerald-600">{dentist.specialty}</p>
                </div>
              </div>
              {/* <div className="mb-4">
                <p className="text-sm text-emerald-600 mb-2">Next available:</p>
                <p className="font-medium text-emerald-900">{dentist.next}</p>
              </div> */}
              <button
                onClick={() => navigate(`/patient-dashboard//book-slot/${dentist._id}`)}
                className="w-full py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientBookConsultation;