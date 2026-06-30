const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "tarushivishwakarma22@gmail.com",
        pass: "myor ymww nlxq hlfw"
    }
});

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    if (role === 'admin') {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) return res.status(400).json({ error: 'Email already in use' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({ username, email, password: hashedPassword });
      await newAdmin.save();

      transporter.sendMail({
          from: "tarushivishwakarma22@gmail.com",
          to: email,
          subject: "Registration Successful",
          text: "You are registered"
      }, (err, data) => {
          if (err) {
              console.log(err);
          } else {
              console.log("Successful");
          }
      });

      return res.status(201).json({ message: 'Admin registered successfully' });
    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'Email already in use' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      transporter.sendMail({
          from: "tarushivishwakarma22@gmail.com",
          to: email,
          subject: "Registration Successful",
          text: "You are registered"
      }, (err, data) => {
          if (err) {
              console.log(err);
          } else {
              console.log("Successful");
          }
      });

      return res.status(201).json({ message: 'User registered successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    if (role === 'admin') {
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(400).json({ error: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: admin._id, username: admin.username, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
      return res.status(200).json({ token, user: { id: admin._id, username: admin.username, email: admin.email, role: 'admin' } });
    } else {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id, username: user.username, role: 'student' }, JWT_SECRET, { expiresIn: '1d' });
      return res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email, role: 'student' } });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, course, bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, course, bio },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
