const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const app = express();

const PORT = process.env.PORT || 8000;

const pool = require('./db');

app.use(cors());
app.use(express.json());

// Email configuration (use your own SMTP settings)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chingolo265@gmail.com',
        pass: 'pflk xawx lhmx auiv'
    },
    tls: {
        rejectUnauthorized: false // Ignore SSL certificate errors
    }
});

async function sendVerificationEmail(email, token) {
    const mailOptions = {
        from: 'your_email@gmail.com', // Replace with your Gmail address
        to: email,
        subject: 'Email Verification',
        html: `<p>Please click <a href="http://localhost:8000/verify/${token}">here</a> to verify your email.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (err) {
        console.error('Error sending verification email:', err);
        throw err;
    }
}

// Sign up with email verification
app.post('/signup', async (req, res) => {
    const { email, user_name, password } = req.body;

    // Simple validation
    if (!email || !user_name || !password || password.length < 5) {
        return res.status(400).json({ message: "Invalid email, username, or password" });
    }

    try {
        // Check if the email is already registered
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Generate verification token
        const verificationToken = uuidv4();

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insert user into the database with verification token
        await pool.query(
            'INSERT INTO users (email, user_name, hashed_password, verification_token, verified) VALUES($1, $2, $3, $4, $5)',
            [email, user_name, hashedPassword, verificationToken, false]
        );

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: "Please check your email for verification" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to sign up. Please try again later.' });
    }
});

// Verify email endpoint
app.get('/verify/:token', async (req, res) => {
    const { token } = req.params;

    try {
        // Find the user with the given verification token
        const user = await pool.query('SELECT * FROM users WHERE verification_token = $1', [token]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found or invalid token' });
        }

        // Verify the token
        if (user.rows[0].verification_token !== token) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Update user as verified
        await pool.query('UPDATE users SET verified = true, verification_token = null WHERE verification_token = $1', [token]);

        res.redirect('http://localhost:3000/');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to verify email. Please try again later.' });
    }
});
// Log in
// Log in
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password || password.length < 5) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const userData = user.rows[0];

        const isValidPassword = bcrypt.compareSync(password, userData.hashed_password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!userData.verified) {
            return res.status(401).json({ message: 'Email not verified. Please check your email for verification instructions.' });
        }

        const token = jwt.sign({ email: userData.email }, 'secret', { expiresIn: '1hr' });

        res.json({ email: userData.email, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Get all tasks for a specific user
app.get('/tasks/:userEmail', async (req, res) => {
    const { userEmail } = req.params;

    try {
        const tasks = await pool.query('SELECT * FROM tasks WHERE user_email = $1', [userEmail]);
        res.json(tasks.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a task
app.post('/tasks', async (req, res) => {
    try {
        const { user_email, title, description, progress, start_date, finish_date } = req.body;

        // Generate UUID for the task
        const taskId = uuidv4();

        // Insert task into the database
        const insertTaskQuery = `
            INSERT INTO tasks (id, user_email, title, description, progress, start_date, finish_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const values = [taskId, user_email, title, description, progress, start_date, finish_date];
        const result = await pool.query(insertTaskQuery, values);
        const newTask = result.rows[0];

        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Edit a task
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { user_email, title, description, progress, start_date, finish_date } = req.body;

    try {
        const editTask = await pool.query('UPDATE tasks SET user_email = $1, title = $2, description = $3, progress = $4, start_date = $5, finish_date = $6 WHERE id = $7',
            [user_email, title, description, progress, start_date, finish_date, id]);
        res.json(editTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a task and its associated activities
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Delete associated activities first
        await pool.query('DELETE FROM activities WHERE task_id = $1', [id]);

        // Then delete the task
        const deleteTask = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        
        if (deleteTask.rowCount === 1) {
            res.json({ message: 'Task and associated activities deleted successfully' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Create an endpoint for activity creation associated with a task
app.post('/tasks/:taskId/activities', async (req, res) => {
    const { taskId } = req.params;
    const { description } = req.body;

    try {
        // Check if the task with the given taskId exists
        const task = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
        if (task.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Insert the activity associated with the task
        const newActivity = await pool.query(
            `INSERT INTO activities (id, activity_title, task_id, activity_date) 
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id`,
            [uuidv4(), description, taskId]
        );

        res.status(201).json({ id: newActivity.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all activities for a specific task
app.get('/activities/:taskId', async (req, res) => {
    const { taskId } = req.params;

    try {
        const activities = await pool.query('SELECT * FROM activities WHERE task_id = $1', [taskId]);
        res.json(activities.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Edit an activity
app.put('/activities/:id', async (req, res) => {
    const { id } = req.params;
    const { activity_title } = req.body;

    try {
        const editActivity = await pool.query('UPDATE activities SET activity_title = $1 WHERE id = $2', [activity_title, id]);
        res.json(editActivity);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete an activity
app.delete('/activities/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleteActivity = await pool.query('DELETE FROM activities WHERE id = $1', [id]);
        if (deleteActivity.rowCount === 1) {
            res.json({ message: 'Activity deleted successfully' });
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Mark an activity as complete
app.put('/activities/:id/complete', async (req, res) => {
    const { id } = req.params;

    try {
        const completeActivity = await pool.query('UPDATE activities SET is_completed = true WHERE id = $1', [id]);
        res.json(completeActivity);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
