const express = require('express');
const router = express.Router();
const Task = require('../Models/Task');
const User = require('../Models/User');
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key"; // Make sure this matches your FastAPI secret

router.post('/CreateTask', async (req, res) => {
    try {
        const { Title, Description, Priority, Type, Due, userData } = req.body;
        
        // Check if required fields are provided
        if (!Title || !Description || !Priority || !Type || !Due || !userData || !userData.token) {
            return res.status(400).json({ message: "All fields are required, including user token." });
        }

        // Decode the JWT to get user info
        let decoded;
        try {
            decoded = jwt.verify(userData.token, JWT_SECRET);
        } catch (tokenError) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Extract user ID from token
        const userId = decoded.id || decoded._id;
        
        if (!userId) {
            return res.status(401).json({ message: "Invalid token: User ID missing" });
        }
        
        console.log("Decoded token:", decoded);
        console.log("User ID:", userId);

        // Find the user by ID to verify existence
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the task already exists for this user
        const existingTask = await Task.findOne({ TaskTitle: Title, userId: userId });
        
        if (existingTask) {
            return res.status(409).json({
                message: "There is already an existing task with the same title for this user.",
            });
        }

        // Create new task with userId reference
        const newTask = new Task({
            TaskTitle: Title,
            Task: Description,
            importance: Priority,
            type: Type,
            Due: Due,
            userId: userId,
        });

        await newTask.save();
        res.json({ message: "Task Created successfully", task: newTask });
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ message: "Failed to create task, please try again." });
    }
});

module.exports = router;