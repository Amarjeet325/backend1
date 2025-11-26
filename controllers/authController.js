const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const createTokenAndSetCookie = (res, user) => {

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, 
        { 
            expiresIn: process.env.JWT_EXPIRES_IN 
        });
    res.cookie(process.env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
     maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days

});

return token;
};


exports.signup = async (req, res) => {

   try {
        const { username, email, password, bio, avatar } = req.body;

        if (!username || !email || !password) 
        return res.status(400).json({ message: 'Missing fields' });


      let user = await User.findOne({ $or: [{ email }, { username }] });
     if (user) return res.status(400).json({ message: 'User already exists' });


      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      user = new User({ username, email, password: hashed, bio, avatar });
      await user.save();


     const token = createTokenAndSetCookie(res, user);
     res.status(201).json({
        message: 'User signed up successfully',
    
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar
      },
        token
    });
      } catch (err) { 
    console.error(err);
    res.status(500).json({ message: ' internal Server error' });
  
}
};


exports.login = async (req, res) => {

  try {
      const { email, password } = req.body;

      if (!email || !password) 
        return res.status(400).json({ message: 'Missing fields' });


    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });


    const token = createTokenAndSetCookie(res, user);
    res.json({
      message: 'Logged in successfully',
      user: { 
        id: user._id,
         username: user.username, 
         email: user.email,
         bio: user.bio,
         avatar: user.avatar
         },
      token
    });
    } catch (err) {
         console.error(err);
        res.status(500).json({ message: ' internal Server error' });
   }
};


exports.logout = (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME);
    res.json({ message: 'Logged out successfully' });
};