// controllers/taskController.js
import Task from '../models/taskModel.js';

// Get All Tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a New Task
export const addTask = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const newTask = new Task({ title, description, date });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Daily Tasks
export const getDailyTasks = async (req, res) => {
  try {
    const { date } = req.query;
    const dailyTasks = await Task.find({ date: { $gte: new Date(date).setHours(0, 0, 0), $lte: new Date(date).setHours(23, 59, 59) } });
    res.status(200).json(dailyTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
