const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/yourDatabaseName';  // Replace with your actual database name

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err);
    });

// Define a Mongoose Schema for the data
const dataSchema = new mongoose.Schema({
    name: String,
    value: String
});

// Create a Mongoose Model based on the Schema
const Data = mongoose.model('Data', dataSchema);

// Endpoint to add data to MongoDB
app.post('/api/data', async (req, res) => {
    const { name, value } = req.body; // Extract name and value from request body

    // Create a new instance of the Data model
    const newData = new Data({
        name,
        value
    });

    try {
        // Save the data to MongoDB
        await newData.save();
        res.status(201).json({ message: 'Data added successfully', data: newData });
    } catch (err) {
        res.status(500).json({ message: 'Error saving data', error: err });
    }
});

// Endpoint to retrieve all data from MongoDB
app.get('/api/data', async (req, res) => {
    try {
        const data = await Data.find(); // Fetch all documents in the "Data" collection
        res.json(data);  // Send data as response
    } catch (err) {
        res.status(500).json({ message: 'Error fetching data', error: err });
    }
});

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
