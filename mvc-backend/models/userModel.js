import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dailyFacts: {
      type: Number, // Changed from int to Number
      required: true,
      default: 0,
    },
    language: {
      type: String,
      required: true,
      default: "en",
    },
    theme: {
      type: String,
      required: true,
    },
    alarms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alarm",
      },
    ],
  },
  { timestamps: true }
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hash the password before updating the user
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
