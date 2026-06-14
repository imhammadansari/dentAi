const slotsModel = require("../models/slotsModel");

const addSlots = async (req, res) => {
    try {
        const { date, start, end } = req.body;
        const dentistId = req.user.id;

        if (!date || !start || !end) {
            return res.status(401).send("All Fields are required");
        }

        const slot = await slotsModel.create({
            date,
            start,
            end,
            dentistId
        });

        res.status(200).json({
            success: true,
            message: "Slot added successfully",
            data: slot
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);

    }
}

const getAllSlots = async (req, res) => {
    try {
        const slots = await slotsModel.find()
            .populate('dentistId', 'name')

        if (!slots) return res.status(403).send("No Slots Found");

        const dentistSlots = slots.map(slot => ({
            id: slot._id,
            dentistId: slot.dentistId?._id,
            dentistName: slot.dentistId?.name,
            date: slot.date.toISOString().split("T")[0],
            start: slot.start,
            end: slot.end
        }));

        res.status(200).json({
            success: true,
            message: "Slots Fetched Successfully",
            data: dentistSlots
        });

    } catch (error) {
        console.log(error.message)

    }
}

const getDentistsSlots = async (req, res) => {
    try {
        const dentistId = req.user.id;
        console.log(dentistId);

        if (!dentistId) return res.status(405).send("Dentist not found");

        const slots = await slotsModel.find({ dentistId });

        if (!slots) return res.status(404).send("No Slots found for that dentist");

        const formattedSlots = slots.map(slot => ({
            id: slot._id,
            date: slot.date.toISOString().split("T")[0],
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
}

const deleteSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const dentistId = req.user.id;

        const slot = await slotsModel.findOneAndDelete({
            _id: id,
            dentistId
        });

        if (!slot) {
            return res.status(404).send("Slot not found");
        }

        res.status(200).json({
            success: true,
            message: "Slot deleted successfully"
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};


module.exports = { addSlots, getAllSlots, getDentistsSlots, deleteSlot }