const user = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

const register = async (req,res) => {
    try{
        const {name,email,password} = req.body;

        const userExists = await user.findOne({email});
        if(userExists){
            return res.status(400).json({
                status: 'faild',
                message: 'user already exists'
            });
        }
        const user = await user.create({ name,email,password});
        const userResponse = user.toObject();
        delete userResponse.password;
        
        const token = generateToken(user._id, user.role);
        res.status(201).json({
            status: 'success',
            token,
            data: userResponse
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const login = async (req,res) => {
  
    try{
          const {email,password}= req.body;
          if(!email || !password){
            return res.status(400).json({
                status: 'faild',
                message: 'please provide email and password'
            });
          }
          const user = await user.findOne({email}).select('+password');
          if(!user || !(await user.matchPassword(password))){
            return res.status(401).json({
                status: 'faild',
                message: 'invalid email or password'
            });
          }
          const token = generateToken(user._id, user.role);
          const userResponse = user.toObject();
          delete userResponse.password;
          res.status(200).json({
            status: 'success',
            token,
            data: userResponse
          });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = {
    register,
    login
}