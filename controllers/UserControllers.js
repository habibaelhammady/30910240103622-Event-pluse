const User = require('../models/User');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    }catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

const getUserById = async (req, res) => {
    try{
       if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    const userData = await User.findById(req.params.id).select('-password');
    if(!userData){
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(userData);
    }catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

const updateUser = async (req, res) => {
    try{
        if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }
        const updates ={};
        if(req.body.name)updates.name = req.body.name;
        if(req.body.email)updates.email = req.body.email;
        if(req.body.password)updates.password = await bcrypt.hash(req.body.password, 10);
        if(req.body.role && req.user.role === 'admin'){
            updates.role = req.body.role;
        };

       const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
       if(!updatedUser){
        return res.status(404).json({ message: 'User not found' });
       }
       res.status(200).json(updatedUser);


    }catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try{
        if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(!deletedUser){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};


module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};