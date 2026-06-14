const slotsModel = require("../models/slotsModel");

const addSlots = async (req, res) => {
    try {
        const { date, start, end } = req.body;
        const dentistId = req.user.id;

        if (!date || !start || !end) {
            return res.status(400).send("All Fields are required");
        }

        // Prevent adding past slots
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        if (date < todayStr || (date === todayStr && start <= currentTime)) {
            return res.status(400).send("Cannot add a slot in the past");
        }

        const slot = await slotsModel.create({ date, start, end, dentistId });

        res.status(200).json({
            success: true,
            message: "Slot added successfully",
            data: slot
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

const getAllSlots = async (req, res) => {
    try {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const slots = await slotsModel.find().populate('dentistId', 'name');

        if (!slots) return res.status(403).send("No Slots Found");

        const dentistSlots = slots
            .filter(slot => {
                const slotDate = slot.date;

                if (slotDate < todayStr) return false;
                if (slotDate === todayStr && slot.end <= currentTime) return false;
                return true;
            })
            .map(slot => ({
                id: slot._id,
                dentistId: slot.dentistId?._id,
                dentistName: slot.dentistId?.name,
                date: slot.date,
                start: slot.start,
                end: slot.end
            }));

        res.status(200).json({
            success: true,
            message: "Slots Fetched Successfully",
            data: dentistSlots
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

const getDentistsSlots = async (req, res) => {
    try {
        const dentistId = req.user.id;

        if (!dentistId) return res.status(405).send("Dentist not found");

        const slots = await slotsModel.find({ dentistId });

        const formattedSlots = slots.map(slot => ({
            id: slot._id,
            date: slot.date,
            start: slot.start,
            end: slot.end
        }));

        res.status(200).json({
            success: true,
            message: "All slots fetched",
            data: formattedSlots
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

const deleteSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const dentistId = req.user.id;

        const slot = await slotsModel.findOneAndDelete({ _id: id, dentistId });

        if (!slot) return res.status(404).send("Slot not found");

        res.status(200).json({
            success: true,
            message: "Slot deleted successfully"
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

module.exports = { addSlots, getAllSlots, getDentistsSlots, deleteSlot };