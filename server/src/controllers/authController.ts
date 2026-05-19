import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/User';

const jwtSecret = process.env.JWT_SECRET || 'secret';

function createToken(user: IUser): string {
  return jwt.sign({ id: user._id.toString(), role: user.role }, jwtSecret, { expiresIn: '7d' });
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { name, email, password, role } = req.body as { name: string; email: string; password: string; role?: 'admin' | 'sales' };
    const normalizedRole = role === 'admin' ? 'admin' : 'sales';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'Email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: normalizedRole });
    res.status(201).json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error as Error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    res.status(200).json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error as Error);
  }
}
