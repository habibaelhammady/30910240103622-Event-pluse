const mongoose = require('mongoose');
const brypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{ type: String, required: true},
    email:{type: String, required: true, unique: true},
    password: {type: String, required:true, minlength:[6,'the password must be at least 6 characters']},
    role:{type:String, enum:['user','admin'], default:'user'}
},{timestamps:true});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    const salt = await brypt.genSalt(10);
    this.password = await bycrypt.hash(this.password,salt);
    next();
});

module.exports = mongoose.model('user',userSchema);