const { mongoose } = require("mongoose");

const SlotSchema = mongoose.Schema({
    dentistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dentists',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model("Slots", SlotSchema);