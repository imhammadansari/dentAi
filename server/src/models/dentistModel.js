const { mongoose } = require("mongoose");

const DentistSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: "Dentist"
    },
    specialty: {
        type: String,
        required: false
    },
    licenseNumber: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    approvalStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Dentists", DentistSchema);