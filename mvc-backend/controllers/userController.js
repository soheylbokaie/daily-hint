import User from "../models/userModel.js";
import crypto from "crypto";

// Get All Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Add a New User
export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete a User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Set user language
export const setUserLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const { language } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { language: language },
      { new: true }
    );
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Toggle user theme between dark and light
export const toggleUserTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.theme = user.theme === "dark" ? "light" : "dark";
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Change user password
export const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      user.password = password;
      await user.save();
      return res.status(200).json(user);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Request the reset password link and set token for the user
export const requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Generate a reset password token and hash it for security
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordTokenHashed = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');
    user.resetPasswordToken = resetPasswordTokenHashed;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();
    return res.status(200).json({ message: "Reset password link sent to your email" });
  }
  catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Reset password for user with reset password link
export const resetUserPassword = async (req, res) => {
  try {
    const { resetPasswordToken, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(404).json({ error: "Invalid or expired reset password token" });
    }
    user.password = newPassword; // You should hash the password before saving it
    user.resetPasswordToken = undefined; // Clear the reset token
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Change dailyFacts number for user
export const changeDailyFacts = async (req, res) => {
  try {
    const { id } = req.params;
    const { dailyFacts } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { dailyFacts: dailyFacts },
      { new: true }
    );
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Add alarm to the user alarms with date and time
export const addAlarm = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, date, time } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const newAlarm = {
      message,
      date,
      time,
    };
    user.alarms.push(newAlarm);
    await user.save();
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Modify alarm message, date or time
export const modifyAlarm = async (req, res) => {
  try {
    const { id, alarmId } = req.params;
    const { message, date, time } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const alarm = user.alarms.id(alarmId);
    if (!alarm) {
      return res.status(404).json({ error: "Alarm not found" });
    }
    alarm.message = message;
    alarm.date = date;
    alarm.time = time;
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
