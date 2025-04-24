import bcrypt from 'bcrypt';
import User from '../../core/data/models/user.js';
import generateToken from '../../utils/jwt.js';
import BaseResponse from '../../core/data/helper/responseWrapper.js';

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json(
                new BaseResponse("User already exists", ["Email is already registered"], null)
            );
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed });

        const token = generateToken(user);
        res.status(201).json(
            new BaseResponse("Signup successful", null, { user, token })
        );
    } catch (err) {
        res.status(500).json(
            new BaseResponse("Signup failed", [err.message], null)
        );
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json(
                new BaseResponse("User not found", ["Invalid email address"], null)
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json(
                new BaseResponse("Invalid credentials", ["Incorrect password"], null)
            );
        }

        const token = generateToken(user);
        res.status(200).json(
            new BaseResponse("Login successful", null, { user, token })
        );
    } catch (err) {
        res.status(500).json(
            new BaseResponse("Login failed", [err.message], null)
        );
    }
};


export default { signup, login };
