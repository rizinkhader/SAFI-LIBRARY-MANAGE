const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/safi_library')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const seedAdmin = async () => {
    try {
        const email = 'admin@safi.com';
        const password = 'admin'; // Change this!

        let user = await User.findOne({ email });
        if (user) {
            console.log('Admin already exists');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name: 'Super Admin',
            email,
            password: hashedPassword,
            role: 'admin'
        });

        await user.save();
        console.log(`Admin created! Email: ${email}, Password: ${password}`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
