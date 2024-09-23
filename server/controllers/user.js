const bcryptjs = require('bcryptjs');
const User = require('../models/User');

const auth = require('../auth');
const { errorHandler } = auth;

module.exports.registerUser = (req, res) => {
    if (!req.body.email.includes("@")) {
        return res.status(400).send({ message: 'Invalid email format' });
    } else if (req.body.password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters long' });
    } else {
        User.findOne({ email: req.body.email })
            .then(existingUser => {
                if (existingUser) {
                    return res.status(400).send({ message: 'Email already in use' });
                }
                let newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: bcryptjs.hashSync(req.body.password, 10)
                });
                return newUser.save();
            })
            .then(() => res.status(201).send({ message: "Registered successfully" }))
            .catch(error => errorHandler(error, req, res));
    }
};

module.exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email.includes("@") || !password) {
        return res.status(400).send({ message: 'Invalid email format or missing password' });
    }

    User.findOne({ email })
        .then(result => {
            if (!result) {
                return res.status(404).send({ message: 'No user found with this email' });
            }
            const isPasswordCorrect = bcryptjs.compareSync(password, result.password);
            if (isPasswordCorrect) {
                const token = auth.createAccessToken(result);
                return res.status(200).send({ access: token });
            } else {
                return res.status(401).send({ message: 'Incorrect email or password' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.getUserDetails = async (req, res) => {
    
    try {
        const userId = req.user.id; // Assuming you're using middleware to set req.user
        const user = await User.findById(userId).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error', error });
    }

}