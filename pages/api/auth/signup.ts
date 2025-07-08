import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { connectToMongoDB } from '../../../lib/mongodb';
import User from '../../../models/User';
import { IUser } from '../../../types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectToMongoDB();

    if (req.method === 'POST') {
      if (!req.body) return res.status(400).json({ error: 'Data is missing' });

      const { fullName, email, password } = req.body;

      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(409).json({ error: 'User Already exists' });
      } else {
        if (password.length < 6)
          return res
            .status(409)
            .json({ error: 'Password should be 6 characters long' });

        const hashedPassword = await hash(password, 12);

        const newUser = await User.create({
          fullName,
          email,
          password: hashedPassword,
        });

        const user = {
          email: newUser.email,
          fullName: newUser.fullName,
          _id: newUser._id,
        };

        return res.status(201).json({
          success: true,
          user,
        });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
