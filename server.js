const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies

// MongoDB connection URI
const MONGO_URI = 'mongodb://localhost:27017/Database1'; // Replace with your actual database name

// Connect to MongoDB using Mongoose
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define a Mongoose Schema for the data
const dataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
});

// Create a Mongoose Model based on the Schema
const Data = mongoose.model('Data', dataSchema);

// API Routes
app.get('/', (req, res) => {
    res.send('Welcome to the server! Use /api/data to interact with the API.');
});

// Endpoint to retrieve all data from MongoDB
app.get('/api/data', async (req, res) => {
    try {
        const data = await Data.find(); // Fetch all documents in the "Data" collection
        res.status(200).json(data); // Send data as response
    } catch (err) {
        res.status(500).json({ message: 'Error fetching data', error: err.message });
    }
});

// Endpoint to add data to MongoDB
app.post('/api/data', async (req, res) => {
    const { name, value } = req.body; // Extract name and value from request body

    try {
        // Validate input
        if (!name || !value) {
            return res.status(400).json({ message: 'Name and Value are required' });
        }

        // Create a new instance of the Data model
        const newData = new Data({ name, value });

        // Save the data to MongoDB
        await newData.save();
        res.status(201).json({ message: 'Data added successfully', data: newData });
    } catch (err) {
        res.status(500).json({ message: 'Error saving data', error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
