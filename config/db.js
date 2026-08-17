const mongoose = require('mongoose');

const connectDB = async () =>{
     try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB is connected');
     }catch (err){
        console.log('Date base connection faild: ', err.message);
        process.exit(1);
     }
};

module.exports = connectDB;