const User = require('../models/User');


const getUser = async (req, res) => {
    
    try {
        if (!req.auth || !req.auth.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const clerkId = req.auth.userId;

        const user = await User.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error while fetching user' });
    }
}

module.exports = {
    getUser
}