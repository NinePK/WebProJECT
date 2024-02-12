const express = require('express');
const router = express.Router();
const db = require('../db');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//===================================================
router.get('/getPost/:postId', (req, res) => {
    const postId = req.params.postId;
    if (!postId) {
        return res.status(400).json({ message: 'Post ID is required' });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        const selectQuery = 'SELECT * FROM Posts WHERE PostID = ?';
        const values = [postId];

        connection.query(selectQuery, values, (error, results) => {
            connection.release();

            if (error) {
                return res.status(500).json({ message: 'Failed to fetch post data' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const post = results[0];
            return res.status(200).json({ post });
        });
    });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
//===================================================
router.get('/getPost/:postId', authenticateToken, (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;

  const sql = `SELECT * FROM post WHERE id = ?`;

  db.query(sql, [postId], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      if (result.length === 0) {
          return res.status(404).json({ error: 'Post not found' });
      }
      const post = result[0];
      // ตรวจสอบว่าผู้ใช้มีสิทธิ์ในการแก้ไขโพสต์นี้หรือไม่
      if (post.uid !== userId) {
          return res.status(403).json({ error: 'You do not have permission to edit this post' });
      }
      res.status(200).json(post);
  });
});

//===================================================

  

  router.post('/addPost', authenticateToken, (req, res) => {
    const { title, description, img, CategoryID, StyleID ,uid} = req.body;

    const sql = `INSERT INTO post (title, description, img, CreateDate, uid, CategoryID, StyleID) 
                 VALUES (?, ?, ?, NOW(), ?, ?, ?)`;
  
    db.query(sql, [title, description, img, uid, CategoryID, StyleID], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(201).json({ message: 'Post added successfully', postId: result.insertId });
    });
  });



  const authEdit = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
  
 router.put('/editPost/:id', authenticateToken, (req, res) => {
    const { id } = req.params; // ID ของโพสต์ที่จะแก้ไข
    const { title, description, img, CategoryID, StyleID } = req.body;

    // คำสั่ง SQL สำหรับอัปเดตโพสต์
    const sql = `UPDATE post SET title = ?, description = ?, img = ?, CategoryID = ?, StyleID = ? WHERE id = ?`;

    // ประมวลผลคำสั่ง SQL พร้อมพารามิเตอร์จากตัวแปร req.body
    db.query(sql, [title, description, img, CategoryID, StyleID, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post updated successfully' });
    });
});

  

router.delete('/deletePost/:id', (req, res) => {
  const { id } = req.params; // ID ของโพสต์ที่ต้องการลบ

  const deleteSql = 'DELETE FROM post WHERE id = ?';
  db.query(deleteSql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      // ไม่พบโพสต์ที่ต้องการลบ
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  });
});



router.get('/likesCount/:postId', (req, res) => {
  const postId = req.params.postId;
  const sql = `SELECT COUNT(*) AS likesCount FROM likes WHERE postId = ?`;

  db.query(sql, [postId], (err, result) => {
    if (err) {
      console.error('Error fetching likes count:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const likesCount = result[0].likesCount;
      res.status(200).json({ likesCount });
    }
  });
});

router.post('/like/:postId', authenticateToken, (req, res) => {
  const { postId ,userId} = req.body;

  const sql = `INSERT INTO likes (postId, userId) VALUES (?, ?)`;

  db.query(sql, [postId, userId], (err, result) => {
    if (err) {
      console.error('Error liking post:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json({ message: 'Post liked successfully' });
    }
  });
});

module.exports = router;