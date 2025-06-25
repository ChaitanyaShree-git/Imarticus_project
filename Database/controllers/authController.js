const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
    try {
        const newUser = req.body;

        const takenUserEmail = await User.findOne({ email: newUser.email });
        const takenUsername = await User.findOne({ username: newUser.username });
        if (takenUserEmail || takenUsername) {
            return res.status(403).send({ error: 'Username or Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newUser.password, salt);

        const user = new User({
            username: newUser.username,
            email: newUser.email,
            password: hashedPassword,
        });

        await user.save();

        const payload = {
            id: user._id,
            username: user.username,
            role: user.role,
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY * 24 * 60 * 60 },
            (error, token) => {
                if (error) {
                    console.error('Error generating jwt:', error.message);
                    return res.status(400).send({ error: 'Token generation failed' });
                }

                return res.status(201).send({
                    message: 'Successfully registered new user',
                    accessToken: token,
                    user: payload,
                });
            }
        );
    } catch (error) {
        console.error('Error registering user:', error.message);
        return res.status(400).send({ error: 'Error registering user' });
    }
};


exports.login = async (req, res) => {
    const user = req.body;
    const existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
        return res.status(401).send({ error: 'Invalid email or password' });
    }
    const isPasswordCorrect = await bcrypt.compare(user.password, existingUser.password)
    if (!isPasswordCorrect) {
        return res.status(401).send({ error: 'Invalid email or password' });
    }
    const payload = { id: existingUser._id, username: existingUser.username, role: existingUser.role }
    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY * 24 * 60 * 60 },
        (error, token) => {
            if (error) {
                console.error('Error generating jwt:', error.message)
                return res.status(400).send({ error: 'Invalid credentials' })
            }
            return res.status(200).send({ message: 'Successfully logged in', accessToken: token, user: payload })
        }
    )
}