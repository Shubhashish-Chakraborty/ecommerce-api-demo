import { z } from 'zod';
import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_USER_SECRET } from '../config';

const signupValidationSchema = z.object({
    fullName: z.string().min(1, { message: 'FullName is required' }),
    username: z.string().min(1, { message: "username is Required" }),
    email: z.string().email({ message: 'Invalid email address' }),
    contactNumber: z.number(),
    password: z.string().min(2, { message: 'Password must be at least 6 characters long' }), // later increase the minimum 
});


// Register a new user
export const SignUp = async (req: Request, res: Response) => {
    try {
        // Validate the request body
        const result = signupValidationSchema.safeParse(req.body);

        // If validation fails, return an error
        if (!result.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: result.error.flatten().fieldErrors,
            });
            return
        }

        const { fullName, username, email, contactNumber, password } = result.data;

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new UserModel({ fullName, username, email, contactNumber, password: hashedPassword });
        await user.save();

        // Return success response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};


export const LogIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Step 1: Find the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        // Step 2: Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
            return
        }

        // Step 3: Generate a JWT token
        const token = jwt.sign({ userId: user._id }, JWT_USER_SECRET, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        // Step 4: Respond with the token
        res.status(200).json({ message: `${user.fullName} successfully LoggedIn`, token });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};


export const getUserData = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId; // Type assertion
        const user = await UserModel.findById(userId).select('-password');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};