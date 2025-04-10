const express = require('express');
const router = express.Router();
const Task = require('../Models/Task'); // adjust if path is different
const jwt = require("jsonwebtoken");

// Helper function to get a random item from an array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

router.post('/test-add-tasks', async (req, res) => {
  try {
    // Use lowercase for importance to match frontend filtering
    const importance = ["low", "medium", "high"];
    
    // Keep the same casing for type as frontend
    const type = ["Work", "Urgent", "Health", "Personal"];
    
    // Match the exact format used in frontend filters
    const due = [
      "Now", 
      "Today", 
      "Tomorrow", 
      "In_3_days",
      "In_a_week",
      "In_2_weeks",
      "In_a_month",
      "No_deadline"
    ];
    
    const tasks = [];
    
    // Static token for testing (replace with real auth in production)
    const userIdToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2YxOWMyZGMzYjE3NzAwN2QxM2U1NWUiLCJlbWFpbCI6ImFhd2V0YXNhcmdhYWFAZ21haWwuY29tIiwiaWF0IjoxNzQzODg3NDA1fQ.VHBaGqo8ETmqCJZcse4d3YwD323IjNCsTN1zHxLuR7Q";
    const decodedUser = jwt.decode(userIdToken);
    const userId = decodedUser?._id;

    for (let i = 1; i <= 100; i++) {
      // Get random values for each task
      const taskImportance = getRandomItem(importance);
      const taskType = getRandomItem(type);
      const taskDue = getRandomItem(due);
      
      tasks.push({
        TaskTitle: `Task ${i} (${taskType} - ${taskImportance})`,
        Task: `This is a ${taskImportance} priority ${taskType.toLowerCase()} task due ${taskDue.toLowerCase().replace(/_/g, ' ')}.`,
        importance: taskImportance,
        type: taskType,
        Due: taskDue,
        userId: userId,
      });
    }

    const inserted = await Task.insertMany(tasks);
    res.status(201).json({ 
      message: 'Test tasks created successfully', 
      count: inserted.length,
      examples: inserted.slice(0, 3) // Return a few examples to verify format
    });
  } catch (error) {
    console.error('Error inserting test tasks:', error);
    res.status(500).json({ error: 'Failed to insert test tasks' });
  }
});

module.exports = router;
