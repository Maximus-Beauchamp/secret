const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "vusmp"
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Login endpoint
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE username = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({status: "Login Failed due to server error"});
        }
        if (data.length > 0) {
            return res.json({status: "Login Successful"});
        } else {
            return res.json({status : "No record found"});
        }
    });
});

// Signup endpoint
app.post('/signup', (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).send({status: "Email and password are required."});
    }

    if (email.length > 50) { // Assuming you want to limit the email length to 30 characters
        return res.status(400).send({status: "Email must be less than 50 characters."});
    }

    // Inserting the new user into the database
    const query = "INSERT INTO login (username, password) VALUES (?, ?)";
    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).send({status: 'Email already in use.'});
            }
            return res.status(500).send({status: 'Error signing up.'});
        }
        return res.status(200).send({status: 'User created successfully.'});
    });
});

app.post('/allergies', (req,res) => {
    const { authUser, allergy } = req.body
    const email = authUser.Name;

    if (!email) {
        return res.status(400).send({status: 'Email cannot be null.'});
    }

    // Inserting the allergy into the database
    const query = "INSERT INTO allergies (username, allergy) VALUES (?, ?)";
    db.query(query, [email, allergy], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({status: 'Something went wrong.'});
        }
        return res.status(200).send({status: 'Allergy added successfully.'});
    });
})

app.post('/preferences', (req,res) => {
    const { authUser, preference } = req.body
    const email = authUser.Name;

    if (!email) {
        return res.status(400).send({status: 'Email cannot be null.'});
    }

    // Inserting the preference into the database
    const query = "INSERT INTO preferences (username, preference) VALUES (?, ?)";
    db.query(query, [email, preference], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({status: 'Something went wrong.'});
        }
        return res.status(200).send({status: 'Preference added successfully.'});
    });
})

app.post('/metrics', (req,res) => {
    const { authUser, gender, age, weight, height, activity_level, fitness_goal, bmr } = req.body
    const email = authUser.Name;

    if (!email) {
        return res.status(400).send({status: 'Email cannot be null.'});
    }

    // Inserting the metrics into the database
    const query = "INSERT INTO metrics (username, gender, age, height, weight, activity_level, fitness_goal, bmr) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [email, gender, age, height, weight, activity_level, fitness_goal, bmr], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({status: 'Something went wrong.'});
        }
        return res.status(200).send({status: 'Metrics added successfully.'});
    });
})

// Start the server
app.listen(8081, () => {
    console.log("Server listening on port 8081...");
});
