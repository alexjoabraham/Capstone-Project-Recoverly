const User = require('../models/User');

const registerUser = async (req, res) => {
  const { 
    name, 
    email, 
    phone, 
    password, 
    org_name, 
    org_address, 
    city, 
    state, 
    pincode, 
    secure_code 
  } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      phone,
      password,  
      org_name,   
      org_address,
      city,
      state,
      pincode,
      secure_code,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { registerUser };
