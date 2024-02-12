const express = require('express');
const router = express.Router();
const db = require('../../db');
const bodyParser = require('body-parser');
const { route } = require('../post');
const app = express();


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



router.get('/categories', (req, res) => {
  const sql = 'SELECT CategoryID, CategoryName FROM Categories';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

router.get('/styles', (req, res) => {
  const sql = 'SELECT StyleID, StyleName FROM Styles';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching Styles:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

router.get("/getImage/:id", (req, res) => {
  const categoryId = req.params.id; 
  const sql = `
    SELECT 
      p.id,
      p.uid,
      p.img,
      p.title,
      p.description,
      p.CreateDate,
      u.Username,
      c.CategoryName,
      s.StyleName,
      COUNT(l.id) AS likesCount
    FROM 
      post AS p
    JOIN 
      Categories AS c ON p.CategoryID = c.CategoryID
    JOIN 
      Styles AS s ON p.StyleID = s.StyleID
    JOIN 
      users AS u ON p.uid = u.UserID
    LEFT JOIN
      likes AS l ON p.id = l.postId
    WHERE 
      c.CategoryID = ?
    GROUP BY
      p.id
    ORDER BY
      likesCount DESC;`;

  // Pass the categoryId variable as a parameter to the query function
  db.query(sql, [categoryId], (err, result) => {
    if (err) {
      res.status(500).send('Error fetching posts for the specified CategoryID');
    } else {
      res.status(200).json(result);
    }
  });
});






module.exports = router;