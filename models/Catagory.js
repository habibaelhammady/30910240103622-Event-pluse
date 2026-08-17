const mongoose = require('mongoose');

const catagorySchema = new mongoose.Schema({
    name: {type: String, required:[true,'Catagory name is required'], unique:true, trim:true}
},{timestamps:true});

module.exports = mongoose.model('catagory',catagorySchema);