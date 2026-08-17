const mongoose = require("mongoose");

const rigstrationSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId ,ref: 'user', required: true},
    event:{type: mongoose.Schema.Types.ObjectId , ref: 'event', require: true}
}, {timestamps: true});

module.exports = mongoose.model('rigstration', rigstrationSchema);
