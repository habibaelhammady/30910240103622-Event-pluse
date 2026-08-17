const catagory = require('../models/Catagory');

const createCatagory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCatagory = await catagory.create({ name, description });
        res.status(201).json(newCatagory);
    }catch (error) {
        res.status(400).json({ message: 'error creating the catagory', error: error.message });
    }

};

const getCatagories = async (req, res) => {
    try{
        const catagories = await catagory.find();
        res.status(200).json(catagories);

    }catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getCatagoryById = async (req, res) => {
    try{
        const catagoryById = await catagory.findById(req.params.id);
        if (!catagoryById){
            return res.status(404).json({ message: 'Catagory not found' });
        }
        res.status(200).json(catagoryById);
    }catch (error) {
        res.status(400).json({ message: 'catagory not found', error: error.message });
    }
};

const updateCatagory = async (req, res) => {
    try{
        const upadatedCatagory = await catagory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!upadatedCatagory){
            return res.status(404).json({ message: 'Catagory not found' });
        }
        res.status(200).json(upadatedCatagory);
    }catch (error) {
        res.status(400).json({ message: 'Error updating catagory', error: error.message });
    }
};

const deleteCatagory = async (req, res) => {
    try{
        const deletedCatagory = await catagory.findByIdAndDelete(req.params.id);
        if (!deletedCatagory){
            return res.status(404).json({ message: 'Catagory not found' });
        
        }
        res.status(200).json({ message: 'Catagory deleted successfully' });
    }catch (error) {
        res.status(400).json({ message: 'Error deleting catagory', error: error.message });
    }
};

 module.exports = { 
    createCategory: createCatagory,
    getCategories: getCatagories, 
    getCategoryById: getCatagoryById,
    updateCategory: updateCatagory, 
    deleteCategory: deleteCatagory 
    };