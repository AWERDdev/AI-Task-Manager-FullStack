const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../Models/User');
const Task = require('../Models/Task');

// Route to update User Password
router.post('/UpdatePassword', async (req, res) => {
    try {
        console.log("route Called")
        const { password, email } = req.body;
        console.log(password);
        console.log(email);

        // Find the user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the new password is the same as the old one
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return res.status(401).json({ message: "New password cannot be the same as the old password" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully",Newpassword:hashedPassword });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});
// Route to update User Bios
router.post('/UpdateUserBios', async (req, res) => {
    try {
        console.log("route Called")
        const {email, bios} = req.body;
        console.log("Receving data from client")
        console.log(bios);
        console.log(email);

        // Find the user by email
        const user = await User.findOne({ email: email });
        console.log("verfiying user")
        if (!user) {
            console.log("user exisits")
            return res.status(404).json({ message: "User not found" });
        }
        console.log("storing bios")
        // Update the user bios
        user.Bios = bios; // Changed from Bios to bio to match the field name in Profile.jsx
        await user.save(); // Add this line to save the changes

        return res.status(200).json({ message: "Bios updated successfully",bios:bios });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
