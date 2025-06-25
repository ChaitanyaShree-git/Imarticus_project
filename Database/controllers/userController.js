const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).send({ users: users })
    } catch (error) {
        console.error('Error fetching all users', error.message);
        return res.status(500).send({ error: 'Error fetching all users' })
    }
}