const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    topics: [{
        type: String,
    }],
    isSubscribed: {
        type: Boolean,
        default: true,
    },
    lastEmailSent: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

// Password hashing middleware
// Fixed: Removed 'next' parameter for async function support in modern Mongoose
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
