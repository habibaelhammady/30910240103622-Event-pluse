const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config()

const User = require('./models/User');
const Catagory = require('./models/Catagory');
const Event = require('./models/Event');

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
    try {
        await User.deleteMany();
        await Catagory.deleteMany();
        await Event.deleteMany();

        console.log('Old data is cleared.');

        const adminUser = await User.create({
            name: 'Admin user',
            email: 'AdminUser@gmail.com',
            password: 'adminuser1234'
        });

        const categories = await Catagory.insertMany([
            { name: 'Books', description: 'Choose the book that will take you to another world.' },
            { name: 'Technology', description: 'Learn and discover new things.' },
        ]);

        await Event.insertMany([
            {
                title: 'magic books',
                capacity: 60,
                data: new Date('2026-08-11'),
                city: 'Cairo',
                catagory: categories[0]._id,
            },
            {
                title: 'technology',
                capacity: 90,
                data: new Date('2026-08-01'),
                city: 'Alexandria',
                catagory: categories[1]._id,
            },
        ]);

        console.log('Seeding successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};
importData();