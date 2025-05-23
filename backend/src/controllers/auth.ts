import { Request, RequestHandler, Response } from "express";
import User from "../models/User";
import { sign } from "jsonwebtoken";
import { CustomRequest } from "../types/middleware";

export const register: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (!firstName) missingFields.push("first name");
    if (!lastName) missingFields.push("last name");

    if (missingFields.length > 0) {
      res.status(400).json({
        message: `The following fields are required: ${missingFields.join(", ")}`,
      });
      return;
    }
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User Already Exists" });
      return;
    }

    const newUser = new User({ email, password, firstName, lastName });
    await newUser.save();

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "JWT_SECRET is not defined" });
      return;
    }
    if (!process.env.LOGIN_DURATION) {
      res.status(500).json({ message: "LOGIN_DURATION is not defined" });
      return;
    }

    const token = sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.LOGIN_DURATION!),
    });

    res.status(201).json({ message: "User Created Successfully", token });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password: plainTextPassword } = req.body;

  if (!email || !plainTextPassword) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  try {
    const userWithEmail = await User.findOne({ email }).select("+password");

    if (!userWithEmail || userWithEmail.status === "inactive") {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    const isPasswordCorrect = userWithEmail.comparePassword(plainTextPassword);

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Incorrect Password" });
      return;
    }

    const token = sign({ _id: userWithEmail._id }, process.env.JWT_SECRET!, {
      expiresIn: parseInt(process.env.LOGIN_DURATION!),
    });

    res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user || user.status === "inactive") {
      res.status(401).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User is authenticated", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
