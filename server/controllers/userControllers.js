const Users = require('../model/user');
const bcrypt = require('bcrypt');
const { logError } = require('../utils/Logger'); 
const jwt = require('jsonwebtoken');


const ctrlRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'This email is already in use' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new Users({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    console.log(createdUser, 'createdUser');

    const user = await createdUser.save();

    res.status(201).json({ message: 'User is registered', user });
  } catch (error) {
    logError(error); // Log the error using logging utility
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

const ctrlLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    
    // Generate JWT token
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1day' });


    res.status(200).json({ message: 'Login success', accessToken , user });
  } catch (error) {
    logError(error); // Log the error using logging utility
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const getUsers = async (req, res) => {
  try {
    const { search, filter, sortBy, sortOrder, page, pageSize } = req.query;

    const query = buildQuery(search, filter);
    const sortOptions = buildSortOptions(sortBy, sortOrder);

    const totalUsersCount = await Users.countDocuments(query);
    const totalPages = calculateTotalPages(totalUsersCount, pageSize);

    const users = await fetchUsers(query, sortOptions, page, pageSize);

    res.status(200).json({
      message: 'User list retrieved successfully',
      users,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const buildQuery = (search, filter) => {
  const query = {};

  if (search) {
    query.email = { $regex: new RegExp(search), $options: 'i' };
  }

  if (filter) {
    query.firstName = { $regex: new RegExp(filter), $options: 'i' };
  }

  return query;
};

const buildSortOptions = (sortBy, sortOrder) => {
  const sortOptions = {};

  if (sortBy) {
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  return sortOptions;
};

const calculateTotalPages = (totalUsersCount, pageSize) => {
  return Math.ceil(totalUsersCount / pageSize);
};

const fetchUsers = async (query, sortOptions, page, pageSize) => {
  return await Users.find(query)
    .sort(sortOptions)
    .skip((page - 1) * pageSize)
    .limit(Number(pageSize));
};


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await Users.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await Users.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { ctrlLogin, ctrlRegister,getUsers ,updateUser,deleteUser};
