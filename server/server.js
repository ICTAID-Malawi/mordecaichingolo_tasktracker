const express = require('express');

const app = express();

const PORT = process.env.PORT ?? 8000;

const pool = require('./db');

//get all tasts

app.get('/tasks', async (req, res) => {

try{
  const tasks =  await pool.query('SELECT * FROM tasks')
  res.json(tasks.rows)
} catch (err) {
    console.error(err);
}

});


app.listen(PORT, () => console.log(`Server is running on ${PORT}`));