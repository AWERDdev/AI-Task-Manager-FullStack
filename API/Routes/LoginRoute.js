const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/User'); 
const JWT_SECRET = "your_secret_key"; 

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
  
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Email and password are required", 
                AUTH: false, 
                field: "email" 
            });
        }

        const user = await User.findOne({ email: email });

        console.log("Checking if user exists");
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ 
                message: "Email not found", 
                AUTH: false, 
                field: "email" 
            });
        }

        if (!user.password) {
            console.log("User password is missing");
            return res.status(500).json({ 
                message: "Server error: User password is missing.", 
                AUTH: false 
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log("Checking if password is valid");

        if (!isValidPassword) {
            console.log("Invalid password");
            return res.status(401).json({ 
                message: "Incorrect password.", 
                AUTH: false, 
                field: "password" 
            });
        }

        // Generate JWT Token
        const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: "1h" });
        const userData = {
            username: user.username,
            name: user.name,
            email: user.email,
            token: token
        };
        // console.log(token)
        res.json({
            token,
            message: "Login successful.",
            User:userData,
            AUTH: true
        });

    } catch (error) {
        console.log("Error details:", error);
        res.status(500).json({ 
            message: "Internal Server Error. Please try again later.", 
            AUTH: false 
        });
    }
});

module.exports = router;
