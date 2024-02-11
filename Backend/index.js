const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userRoutes = require('./route/user');
const postRoutes = require('./route/post');
const roomRoutes = require('./route/getroom/room');
const dotenv = require('dotenv').config();
const app = express();
const port = 8000;
const multer = require('multer');
const cors = require('cors');
const path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));


app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../Frontend/public/upload/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+file.originalname);
  },
});

const upload = multer({ storage });
app.use('/uploads', express.static('../uploads'));

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
  console.log(file.filename);
});




app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/rooms',roomRoutes); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});