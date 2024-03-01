const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express();

const PORT = process.env.PORT ?? 8000;

const pool = require('./db');


app.use(cors())
app.use(express.json())

//get all tasks

app.get('/tasks/:userEmail', async (req, res) => {
    console.log(req)
    const {userEmail} = req.params

try{
  const tasks =  await pool.query('SELECT * FROM tasks WHERE user_email = $1', [userEmail])
  res.json(tasks.rows)
} catch (err) {
    console.error(err);
}

});


//Create a Task

app.post('/tasks', async (req, res) => {
    const { user_email, title, date } = req.body
    console.log( user_email, title, date )
    const id = uuidv4()
    try{
        const newTask = await pool.query(`INSERT INTO tasks(id, user_email, title, date) VALUES($1, $2, $3, $4)`,
        [id, user_email, title, date])

        res.json(newTask)


    } catch (err) {
        console.error(err)
    }
})


//Edit a Task

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { user_email, title, date } = req.body;
    try {
        const editTask = await pool.query('UPDATE tasks SET user_email = $1, title = $2, date = $3 WHERE id = $4', [user_email, title, date, id]);
        res.json(editTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Delete a Task

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleteTask = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        if (deleteTask.rowCount === 1) {
            res.json({ message: "Task deleted successfully" });
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Sign up
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
        const signUp = await pool.query(
            'INSERT INTO users (email, hashed_password) VALUES($1, $2)',
            [email, hashedPassword]
        );

        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });

        res.json({ email, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Log in
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isValidPassword = bcrypt.compareSync(password, user.rows[0].hashed_password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ email: user.rows[0].email }, 'secret', { expiresIn: '1hr' });

        res.json({ email: user.rows[0].email, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.listen(PORT, () => console.log(`Server is running on ${PORT}`));