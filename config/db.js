const mongoose = require('mongoose');

const connectDB = async () =>{
     try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB is connected');
     }catch (erro){
        console.log('Date base connection faild: ', err.message);
        process.exit(1);
     }
};

module.exports = connectDB;