const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const router = express.Router();
const db = require('../db');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const authenticateToken = (req, res, next) => {
    // ตรวจสอบ token จาก header หรือ cookie
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: "A token is required for authentication" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      return res.status(403).json({ error: "Invalid Token" });
    }
    return next();
  };
  router.get('/protectedRoute', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the protected route!' });
  });
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
router.get('/categories', (req, res) => {
    const sql = 'SELECT CategoryName FROM Categories';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

router.get('/getStyle', (req, res) => {
    const sql = 'SELECT StyleName FROM styles';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

router.get('/getImage', (req, res) => {
    const sql = `
      SELECT p.img, c.CategoryID, c.CategoryName, s.StyleID, s.StyleName
      FROM post p
      JOIN Categories c ON p.CategoryID = c.CategoryID
      JOIN Styles s ON p.StyleID = s.StyleID
    `;
  
    db.query(sql, (error, results) => {
      if (error) throw error;
      res.json(results); // ส่งข้อมูลที่ได้กลับไปเป็น JSON
    });
  });


router.get('/getImage/:id', (req, res) => {
    const id = req.params.id; // รับ ID จาก URL
  
    // SQL query เพื่อดึง imagePath จากฐานข้อมูล
    const sql = 'SELECT img FROM post WHERE id = ?';
  
    db.query(sql, [id], (error, results) => {
      if (error) {
        res.status(500).send('Server error');
        throw error;
      }
  
      if (results.length > 0) {
        const imagePath = results[0].img; // imagePath จากฐานข้อมูล
        res.sendFile(imagePath, { root: '.' }, (err) => {
          if (err) {
            // ส่งข้อความ error หากไม่พบไฟล์
            res.status(404).send('Image not found');
          }
        });
      } else {
        // ส่งข้อความ error หากไม่พบ record ในฐานข้อมูล
        res.status(404).send('Image not found');
      }
    });
  });
//===================================================

router.post('/addPost',(req, res) => {
    const token = req.cookies.secret;
    if (!token) return res.status(401).json("Not authenticated!");
  
    jwt.verify(token,jwtSecret, (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q =
        "INSERT INTO post(`title`, `description`, `img`, `categoryID`, `CreateDate`,`StyleID`,`uid`) VALUES (?)";
  
      const values = [
        req.body.title,
        req.body.description,
        req.body.img,
        req.body.catcategoryID,
        req.body.styleID,
        req.body.CreateDate,
        userInfo.id,
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Post has been created.");
      });
    });
  });








// router.post('/addPost', (req, res) => {
//     const token = req.cookies.token;
//   if (!token) return res.status(401).json("Not authenticated!");

//   jwt.verify(token, jwtSecret, (err, userInfo) => {
//     if (err) return res.status(403).json("Token is not valid!");

//     const q =
//       "INSERT INTO post(`title`, `description`, `img`, `categoryID`, `CreateDate`,`StyleID`,`uid`) VALUES (?)";

//     const values = [
//       req.body.title,
//       req.body.description,
//       req.body.img,
//       req.body.categoryID,
//       req.body.styleID,
//       req.body.Createdate,
//       userInfo.id,
//     ];

//     db.query(q, [values], (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.json("Post has been created.");
//     });
// });
// });


router.put('/updatePost/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { title, description, img, CategoryID, StyleID } = req.body;
  
    const sql = `UPDATE post SET title = ?, desc = ?, img = ?, CategoryID = ?, StyleID = ? WHERE id = ?`;
  
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