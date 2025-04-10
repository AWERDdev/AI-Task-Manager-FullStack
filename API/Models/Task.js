const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  TaskTitle: { type: String,required: true },
  Task: { type: String, required: true },
  importance: { type: String,required: true },
  type: { type: String, required: true },
  Due: { type: String, required: true },
  userId:{ type: String, required: true },
});

// Prevent model overwrite error
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

module.exports = Task;
``