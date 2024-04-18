const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "Maximus",
    password: "Cookie721721.",
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

app.post('/allergies', (req, res) => {
    const { authUser, allergy } = req.body;
    const email = authUser.Name;

    if (!email) {
        return res.status(400).send({status: 'Email cannot be null.'});
    }

    // Delete existing allergies
    const deleteQuery = "DELETE FROM allergies WHERE username = ?";
    db.query(deleteQuery, [email], (deleteErr, deleteResult) => {
        if (deleteErr) {
            console.error(deleteErr);
            return res.status(500).send({status: 'Something went wrong.'});
        }

        // Insert the new allergy
        const insertQuery = "INSERT INTO allergies (username, allergy) VALUES (?, ?)";
        db.query(insertQuery, [email, allergy], (insertErr, insertResult) => {
            if (insertErr) {
                console.error(insertErr);
                return res.status(500).send({status: 'Something went wrong.'});
            }
            return res.status(200).send({status: 'Allergy updated successfully.'});
        });
    });
});


app.post('/preferences', (req, res) => {
    const { authUser, preference } = req.body;
    const email = authUser.Name;

    if (!email) {
        return res.status(400).send({status: 'Email cannot be null.'});
    }

    // First, delete existing preferences
    const deleteQuery = "DELETE FROM preferences WHERE username = ?";
    db.query(deleteQuery, [email], (deleteErr, deleteResult) => {
        if (deleteErr) {
            console.error(deleteErr);
            return res.status(500).send({status: 'Something went wrong.'});
        }

        // Then, insert the new preference
        const insertQuery = "INSERT INTO preferences (username, preference) VALUES (?, ?)";
        db.query(insertQuery, [email, preference], (insertErr, insertResult) => {
            if (insertErr) {
                console.error(insertErr);
                return res.status(500).send({status: 'Something went wrong.'});
            }
            return res.status(200).send({status: 'Preference updated successfully.'});
        });
    });
});

app.post('/metrics', (req, res) => {
    const { authUser, gender, age, height, weight, activity_level, fitness_goal, bmr } = req.body;
    const email = authUser.Name;

    if (!email) {
        return res.status(400).send({status: 'Email cannot be null.'});
    }

    // Delete existing metrics
    const deleteQuery = "DELETE FROM metrics WHERE username = ?";
    db.query(deleteQuery, [email], (deleteErr, deleteResult) => {
        if (deleteErr) {
            console.error(deleteErr);
            return res.status(500).send({status: 'Something went wrong.'});
        }

        // Insert new metrics
        const insertQuery = "INSERT INTO metrics (username, gender, age, height, weight, activity_level, fitness_goal, bmr) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(insertQuery, [email, gender, age, height, weight, activity_level, fitness_goal, bmr], (insertErr, insertResult) => {
            if (insertErr) {
                console.error(insertErr);
                return res.status(500).send({status: 'Something went wrong.'});
            }
            return res.status(200).send({status: 'Metrics updated successfully.'});
        });
    });
});


app.get('/profile-info', (req, res) => {
    const email = req.query.username; // Correctly access the username query parameter
    const userData = {};
    
    // Assuming you've corrected your query to match the database schema
    const loginQuery = "SELECT * FROM `login` WHERE username = ?";
    db.query(loginQuery, [email], (err, loginResult) => {
        if (err) {
            console.error(err);
            return res.status(500).send({status: 'Something went wrong fetching login info.'});
        }

        if (loginResult.length > 0) {
            userData.login = loginResult[0];

            // Query for allergies
            const allergiesQuery = "SELECT * FROM allergies WHERE username = 'rohan.k.bhatia@vanderbilt.edu'";
            db.query(allergiesQuery, [email], (allergyErr, allergiesResult) => {
                if (allergyErr) {
                    console.error(allergyErr);
                    return res.status(500).send({status: 'Something went wrong fetching allergies.'});
                }
                userData.allergies = allergiesResult;

                // Query for preferences
                const preferencesQuery = "SELECT * FROM preferences WHERE username = 'rohan.k.bhatia@vanderbilt.edu'";
                db.query(preferencesQuery, [email], (preferenceErr, preferencesResult) => {
                    if (preferenceErr) {
                        console.error(preferenceErr);
                        return res.status(500).send({status: 'Something went wrong fetching preferences.'});
                    }
                    userData.preferences = preferencesResult;

                    // Query for metrics
                    const metricsQuery = "SELECT * FROM metrics WHERE username = 'rohan.k.bhatia@vanderbilt.edu'";
                    db.query(metricsQuery, [email], (metricsErr, metricsResult) => {
                        if (metricsErr) {
                            console.error(metricsErr);
                            return res.status(500).send({status: 'Something went wrong fetching metrics.'});
                        }
                        userData.metrics = metricsResult;

                        // Send all data
                        return res.status(200).send(userData);
                    });
                });
            });
        } else {
            console.log(loginQuery);
            return res.status(404).send({status: 'User not found.'});
        }
    });
});

app.post('/change-password', (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
        return res.status(400).send({status: "All fields are required."});
    }

    // Check if the new password is the same as the current password
    if (currentPassword === newPassword) {
        return res.status(400).send({status: "The new password must be different from the current password."});
    }

    // First, check if the user with the provided email exists and verify the current password
    const checkUserSql = "SELECT * FROM login WHERE username = ?";
    db.query(checkUserSql, [email], (err, users) => {
        if (err) {
            console.error(err);
            return res.status(500).send({status: "Error checking user existence."});
        }
        if (users.length === 0) {
            return res.status(404).send({status: "User not found."});
        }

        const user = users[0];

        // Check if the current password matches
        if (user.password !== currentPassword) {
            return res.status(401).send({status: "New Password can not match previous Password."});
        }

        // Update the password in the database
        const updatePasswordSql = "UPDATE login SET password = ? WHERE username = ?";
        db.query(updatePasswordSql, [newPassword, email], (updateErr, updateResult) => {
            if (updateErr) {
                console.error(updateErr);
                return res.status(500).send({status: "Error updating password."});
            }
            return res.status(200).send({status: "Password updated successfully."});
        });
    });
});

app.post('/forgot-password', (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).send({status: "Email and new password are required."});
    }

    // Optional: Add more validation for the newPassword, e.g., minimum length, complexity, etc.

    // First, check if the user with the provided email exists
    const checkUserSql = "SELECT * FROM login WHERE username = ?";
    db.query(checkUserSql, [email], (err, users) => {
        if (err) {
            console.error(err);
            return res.status(500).send({status: "Error checking user existence."});
        }
        if (users.length === 0) {
            return res.status(404).send({status: "User not found."});
        }

        // User exists, update the password in the database
        const updatePasswordSql = "UPDATE login SET password = ? WHERE username = ?";
        db.query(updatePasswordSql, [newPassword, email], (updateErr, updateResult) => {
            if (updateErr) {
                console.error(updateErr);
                return res.status(500).send({status: "Error updating password."});
            }
            return res.status(200).send({status: "Password updated successfully."});
        });
    });
});

app.post('/journal', (req, res) => {
    const { username, itemName, macros, totalCalories, dateOfEntry } = req.body;
    // Parse grams and calories from the strings (assuming your database expects numeric values)
    const proteinGrams = parseInt(macros.protein.replace('g', ''), 10);
    const fatGrams = parseInt(macros.fat.replace('g', ''), 10);
    const carbsGrams = parseInt(macros.carbs.replace('g', ''), 10);
    const totalCaloriesValue = parseInt(totalCalories.replace(' calories', ''), 10);

    const query = `
        INSERT INTO meal_journal (user_name, item_name, protein, fat, carbs, total_calories, date_of_entry) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Use parsed values in the query
    const values = [username, itemName, proteinGrams, fatGrams, carbsGrams, totalCaloriesValue, dateOfEntry];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error adding meal journal entry:', err);
            return res.status(500).send({status: 'Error adding meal journal entry.'});
        }
        res.status(200).send({status: 'Meal journal entry added successfully with hardcoded data.'});
    });
});

// Fetch BMR endpoint
app.get('/bmr', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).send({status: "Username is required."});
    }

    const query = "SELECT bmr FROM metrics WHERE username = ?";
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({status: 'Error fetching BMR.'});
        }
        if (results.length > 0) {
            res.status(200).json({ bmr: results[0].bmr });
        } else {
            res.status(404).send({status: 'BMR not found for the user.'});
        }
    });
});

app.delete('/clear-journal', (req, res) => {

    const {username} = req.query;

    if (!username) {
        return res.status(400).send({status: "Username is required."});
    }

    const query = "DELETE FROM meal_journal WHERE user_name = ?";
    db.query(query, [username], (err, result) => {
        if (err) {
            console.error('Error clearing meal journal:', err);
            return res.status(500).send({status: 'Error clearing meal journal.'});
        }
        res.status(200).send({status: 'Meal journal cleared successfully.'});
    });
});

app.get('/mealJournal', (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).send({status: "Username is required."});
    }

    const query = "SELECT * FROM meal_journal WHERE user_name = ?";
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching meal journal:', err);
            return res.status(500).send({status: 'Error fetching meal journal.'});
        }
        res.status(200).json(results);
    });
});


// BANDAID FIX FOR NOW
app.get('/profile-rohan', (req, res) => {
    const hardcodedUsername = 'rohan.k.bhatia@vanderbilt.edu';

    // Single query to fetch all relevant data
    const userQuery = `
        SELECT l.username, l.password, 
               a.allergy, 
               p.preference, 
               m.gender, m.age, m.height, m.weight, m.activity_level, m.fitness_goal, m.bmr
        FROM login l
        LEFT JOIN allergies a ON l.username = a.username
        LEFT JOIN preferences p ON l.username = p.username
        LEFT JOIN metrics m ON l.username = m.username
        WHERE l.username = ?
    `;

    db.query(userQuery, [hardcodedUsername], (err, results) => {
        if (err) {
            console.error('DB Error:', err);
            return res.status(500).send({status: 'Failed to fetch user data.'});
        }
        if (results.length === 0) {
            return res.status(404).send({status: 'User not found.'});
        }

        // Organizing data
        const userData = {
            loginInfo: results[0],
            allergies: results.filter(r => r.allergy).map(r => r.allergy),
            preferences: results.filter(r => r.preference).map(r => r.preference),
            metrics: results[0]
        };

        // Example of creating a prompt for an AI based on fetched data
        const prompt = `Given a BMR of ${userData.metrics.bmr}, current intake of 2500 calories, 
        and a fitness goal of '${userData.metrics.fitness_goal}', suggest a meal plan considering 
        allergens: ${userData.allergies.join(', ')}.`;

        console.log('AI Prompt:', prompt);
        res.status(200).json({ userData, aiPrompt: prompt });
    });
});

// Start the server
app.listen(8081, () => {
    console.log("Server listening on port 8081...");
});
