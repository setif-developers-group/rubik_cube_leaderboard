import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'change_me';

export const register = async (req, res) => {
   try {
     const { name, email, password } = req.body;
     const existing = await User.findOne({ where: { email } });
     if (existing) return res.status(400).json({ message: 'User already exists' });
     const salt = await bcrypt.genSalt(10);
     const hashed = await bcrypt.hash(password, salt);
     const user = await User.create({ name, email, password: hashed });
     const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '7d' });
     res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
   } catch (err) {
     console.error(err);
     res.status(500).json({ message: 'Server error' });
   }
 };

export const login = async (req, res) => {
   try {
     const { email, password } = req.body;
     const user = await User.findOne({ where: { email } });
     if (!user) return res.status(400).json({ message: 'Invalid credentials' });
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
     const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '7d' });
     res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
   } catch (err) {
     console.error(err);
     res.status(500).json({ message: 'Server error' });
   }
 };
