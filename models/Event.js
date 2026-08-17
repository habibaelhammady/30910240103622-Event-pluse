const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
    title:{ type: String, required:[true,'Event tilte is required']},
    capacity:{type: Number, required:[true,'Capacity number is required'], min:1},
    data:{type: Date, required:[true,'Event date is required']},
    city:{type: String, required:[true,'city name is required']},
    catagory:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'catagory',
        required: [true, 'Event ID is required']
    }
},{timestamps:true});

module.exports = mongoose.model('event',eventSchema);