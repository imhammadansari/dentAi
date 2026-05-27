const bookingModel = require("../models/bookingModel");
const slotsModel = require("../models/slotsModel");

const bookSlot = async (req, res) => {
    try {
        const { slotId } = req.body;
        const patientId = req.user.id;

        const slot = await slotsModel.findById(slotId);

        if (!slot) {
            return res.status(404).send("Slot not found");
        }

        const alreadyBooked = await bookingModel.findOne({ slotId });

        if (alreadyBooked) {
            return res.status(400).send("Slot already booked");
        }

        const booking = await bookingModel.create({
            patientId,
            dentistId: slot.dentistId,
            slotId,
            date: slot.date.toISOString().split("T")[0], // 👈 FIX HERE
            start: slot.start,
            end: slot.end
        });

        res.status(200).json({
            success: true,
            message: "Appointment booked",
            data: booking
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

const getSingleDentistSlots = async (req, res) => {
    try {
        const { dentistId } = req.params;

        const slots = await slotsModel.find({ dentistId });

        res.status(200).json({
            success: true,
            data: slots
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

const getDentistPatients = async (req, res) => {
    try {
        const dentistId = req.user.id;

        const bookings = await bookingModel.find({ dentistId })
            .populate("patientId", "name email phone")
            .sort({ createdAt: -1 });

        // 🔥 UNIQUE PATIENTS
        const uniquePatientsMap = new Map();

        let upcomingCount = 0;
        let completedCount = 0;

        bookings.forEach(b => {
            const pid = b.patientId?._id?.toString();

            if (!uniquePatientsMap.has(pid)) {
                uniquePatientsMap.set(pid, {
                    id: pid,
                    name: b.patientId?.name,
                    email: b.patientId?.email,
                    phone: b.patientId?.phone,
                    totalVisits: 0,
                    completedVisits: 0
                });
            }

            const patient = uniquePatientsMap.get(pid);

            patient.totalVisits += 1;

            if (b.status?.toLowerCase() === "completed") {
                patient.completedVisits += 1;
            }

            if (b.status?.toLowerCase() === "booked") {
                upcomingCount += 1;
            }
        });

        const patients = Array.from(uniquePatientsMap.values());

        const avgVisits =
            patients.reduce((sum, p) => sum + p.completedVisits, 0) /
            (patients.length || 1);

        res.json({
            success: true,
            patients,
            stats: {
                totalPatients: patients.length,
                upcomingConsultations: upcomingCount,
                completedPatients: patients.filter(p => p.completedVisits > 0).length,
                avgVisits: avgVisits.toFixed(1)
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getSinglePatientBookings = async (req, res) => {
    try {
        const dentistId = req.user.id;
        const { patientId } = req.params;

        const bookings = await bookingModel.find({
            dentistId,
            patientId
        })
            .populate("patientId", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookings
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updatePatientStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        const booking = await bookingModel.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).send("Booking not found");
        }

        res.status(200).json({
            success: true,
            message: "Status updated",
            data: booking
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

const getPatientConsultations = async (req, res) => {
    try {
        const patientId = req.user.id;

        const consultations = await bookingModel.find({ patientId })
            .populate("dentistId", "name email")
            .sort({ createdAt: -1 });

        const totalVisits = consultations.filter(
            (c) => c.status?.toLowerCase() === "completed"
        ).length;

        const formatted = consultations.map((c) => ({
            id: c._id,
            date: c.date,
            time: `${c.start} - ${c.end}`,
            dentist: c.dentistId?.name,
            status: c.status,
            notes: c.notes || ""
        }));

        res.json({
            success: true,
            data: formatted,
            totalVisits
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    bookSlot, getSingleDentistSlots,
    getDentistPatients, updatePatientStatus, getPatientConsultations, getSinglePatientBookings
};