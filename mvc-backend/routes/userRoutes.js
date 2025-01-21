import express from "express";
import {
  getUsers,
  addUser,
  deleteUser,
  setUserLanguage,
  toggleUserTheme,
  changeUserPassword,
  requestResetPassword,
  resetUserPassword,
  changeDailyFacts,
  addAlarm,
  modifyAlarm,
} from "../controllers/userController.js";

const router = express.Router();

// all Routes
router.get("/", getUsers);
router.post("/", addUser);
router.delete("/:id", deleteUser);
router.put("/language/:id", setUserLanguage);
router.put("/theme/:id", toggleUserTheme);
router.put("/password/:id", changeUserPassword);
router.post("/request-reset-password", requestResetPassword);
router.put("/reset-password", resetUserPassword);
router.put("/daily-facts/:id", changeDailyFacts);
router.post("/alarm/:id", addAlarm);
router.put("/alarm/:id/:alarmId", modifyAlarm);

export default router;
