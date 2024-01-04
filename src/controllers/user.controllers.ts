import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { generateToken } from '../helpers/jwt-token';
import { User } from '../models/user.model';

/**
 * @public
 * POST request
 * @route /api/users/register
 * Controller to register a new user
 */
export const register = asyncHandler(async (req: any, res: Response) => {
  try {
    const { name, email, password } = req.body;

    //This helps to complete the password match
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @public
 * Post request
 * @route  /api/users/login
 * Controller to generate a new token for user
 */
export const login = asyncHandler(async (req: any, res: Response) => {
  try {
    const { email, password } = req.body;

    //This helps to complete the password match
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @protected
 * Get request
 * @route /api/users/profile
 * Controller to fetch user profile
 */
export const getUserProfile = asyncHandler(async (req: any, res: Response) => {
  try {
    const user = await User.findById(req?.user?._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @protected
 * PUT request
 * @route /api/users/profile
 * Controller to update a user profile
 */
export const updateUserProfile = asyncHandler(async (req: any, res: Response) => {
  try {
    const user = await User.findById(req?.user?._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @private for admins alone
 * Get request
 * @route /api/users
 * Controller to get all the users
 * TODO: Add pagination
 */
export const getUsers = asyncHandler(async (req: any, res: Response) => {
  try {
    const users = await User.find({});

    if (!users.length) {
      res.status(404);
      throw new Error('Users not found');
    }
    res.json(users);
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @private for admins
 * Delete request
 * @route /api/users/:id
 * Controller to remove a user from the system
 * TODO: Do not remove users entirely. Instead deactivate users
 */
export const deleteUser = asyncHandler(async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    await user.deleteOne();
    res.json({ message: 'User [ ' + user.name + ' ] has been removed Successfully' });
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @private for admins
 * Get request
 * @route /api/users/:id
 * Controller to get a user by their Id.
 */
export const getUserById = asyncHandler(async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json(user);
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @private for admins
 * PUT request
 * @route  /api/users/:id
 * Controller to update a user by an admin
 */
export const updateUser = asyncHandler(async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin || user.isAdmin;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
});
