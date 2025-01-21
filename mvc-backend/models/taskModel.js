// models/taskModel.js
import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
export default Task;
