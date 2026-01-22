const { mongoose } = require("mongoose");

const AdminSchema = mongoose.Schema({
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
        default: "Admin"
    },
    permissions: {
        type: [String],
        default: ["manage_users", "manage_dentists", "view_reports", "system_settings"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Admins", AdminSchema);