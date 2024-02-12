const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const router = express.Router();


app.use(express.json());

////// Database connection
const db = require('../db');
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

//จัดการ cookie
const jwtSecret = process.env.JWT_SECRET;
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Route สำหรับการลงทะเบียน
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // ตรวจสอบอีเมลซ้ำ
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.status(400).json({ msg: 'Email already exists' });
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // บันทึกผู้ใช้ใหม่ลงในฐานข้อมูล
      const newUser = { Username: username, Email: email, Password: hashedPassword };
      db.query('INSERT INTO users SET ?', newUser, (err, result) => {
        if (err) throw err;
        res.status(201).json({ msg: 'registered successfully' });
      });
    }
  });
});
router.post('/login', (req, res) => {
  const q = "SELECT * FROM users WHERE email = ?";
  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);
    if (!isPasswordCorrect) return res.status(400).json("Wrong username or password!");
    const token = jwt.sign({ id: data[0].id }, jwtSecret);
    
    const { password, ...other } = data[0];

    // Send userID, token, and other user data back
    res.status(200).json({ ...other, token });
  });
});


router.post('/logout', (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});


router.get('/getUsers', (req, res) => {
  const sql = "select * from users";
  db.query(sql, (err, data) => {
    if (err) return res.json({ error: "Error in getting users" });
    return res.json(data);
  }); 
});


module.exports = router;










