const mongoose = require('mongoose');

const MONGO_URI = `mongodb+srv://parthsinghal2022:alUPI6t2nTo5E8WF@cluster0.iumikea.mongodb.net/moviesreview`

const mongoConnection = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Successfully connected to MongoDB")
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);
    }
}

module.exports = mongoConnection;
