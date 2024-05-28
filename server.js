
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/registration', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
  console.log('Connected to database');
});

const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});
const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Ensure this line is present

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      login: req.body.login,
      password: hashedPassword,
      phone: req.body.phone,
      email: req.body.email,
    });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ login: req.body.login });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid login or password');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
