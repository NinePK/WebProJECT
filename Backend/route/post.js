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

//===================================================
router.get('/getAllPosts', (req, res) => {
    // Check if the user is authenticated (use session for this)
    if (!req.session.isAuthenticated) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        const selectQuery = 'SELECT * FROM Posts';
        connection.query(selectQuery, (error, results) => {
            connection.release();

            if (error) {
                return res.status(500).json({ message: 'Failed to retrieve posts data' });
            }

            return res.status(200).json({ posts: results });
        });
    });
});

//===================================================
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

router.put('/updatePost/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { title, description, img, CategoryID, StyleID } = req.body;
  
    const sql = `UPDATE post SET title = ?, description = ?, img = ?, CategoryID = ?, StyleID = ? WHERE id = ?`;
  
    db.query(sql, [title, description, img, CategoryID, StyleID, id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Failed to update the post' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.json({ msg: 'Post updated successfully' });
    });
  });

  router.delete('/deletePost/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
  
    const sql = `DELETE FROM post WHERE id = ?`;
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Failed to delete the post' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.json({ msg: 'Post deleted successfully' });
    });
  });


module.exports = router;