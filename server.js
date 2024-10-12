const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 3000; // You can change this to any port you prefer

app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Sample in-memory data store for users
let users = [];

// Registration endpoint
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ name, email, password: hashedPassword }); // Store user in the in-memory array

    res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
        res.json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// New route to get all registered users
app.get('/users', (req, res) => {
    // Return users without passwords
    res.status(200).json(users.map(({ password, ...user }) => user));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
