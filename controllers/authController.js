import bcrypt from "bcryptjs";
import User from "../model/User.js";
import jwt from "jsonwebtoken";

const signToken = async (id, name) => {
  const token = await jwt.sign({ id, name }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export const signUp = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    if (!email || !password || !name || !passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide all the details.",
      });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Passwords do not match.",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists. Try with a different email.",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
    });

    const token = await signToken(newUser._id, newUser.name);

    // DONOT PASS PASSWORD LATER IN THE RESPONSE

    res.status(200).json({
      status: "success",
      message: "New Account created",
      token,
      newUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide both email and password.",
      });
    }

    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(400).json({
        status: "fail",
        message: "Either email or password is wrong",
      });
    }

    const passwordCorrect = await bcrypt.compare(password, userExists.password);
    if (!passwordCorrect) {
      return res.status(400).json({
        status: "fail",
        message: "Either email or password is wrong",
      });
    }

    const token = await signToken(userExists._id, userExists.name);

    // DONOT PASS PASSWORD LATER IN THE RESPONSE

    res.status(200).json({
      status: "success",
      message: "Signing you In.",
      user: userExists,
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
