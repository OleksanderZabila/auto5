const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Add bcrypt for password hashing
const app = express();
const port = 3000; // Define port

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/registration', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Обработка ошибок подключения к базе данных
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
  console.log('Connected to database');
});

// Схема и модель пользователя
const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});
const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Схема модели для отчетов об ошибках
const bugReportSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: String,
  status: String,
});

const BugReport = mongoose.model('BugReport', bugReportSchema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Маршрут для создания нового отчета об ошибке
app.post('/bug-report', async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const newBugReport = new BugReport({
      title,
      description,
      priority,
      status: 'New',
    });
    await newBugReport.save();
    res.status(201).send('Bug report created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating bug report');
  }
});

// Регистрация пользователя
app.post('/register', async (req, res) => {
  try {
    // Проверка CAPTCHA (в этом примере не реализована)
    
    // Хеширование пароля перед сохранением
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Создание нового пользователя
    const newUser = new User({
      login: req.body.login,
      password: hashedPassword,
      phone: req.body.phone,
      email: req.body.email,
    });

    // Сохранение пользователя в базе данных
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});

// Аутентификация пользователя
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

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
