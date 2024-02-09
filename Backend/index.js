const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userRoutes = require('./route/user');
const postRoutes = require('./route/post');
const dotenv = require('dotenv').config();
const app = express();
const port = 8000;
const multer = require('multer');
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use('/uploads', express.static('uploads'));



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).json({ url: `/uploads/${file.filename}` });
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});