const mongoose = require('mongoose');

const pageColorSchema = new mongoose.Schema({
    page: { type: String, required: true, unique: true },
    color: { type: String, required: true, default: '#ffffff' }
});

module.exports = mongoose.model('PageColor', pageColorSchema);
