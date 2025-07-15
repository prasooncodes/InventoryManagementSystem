const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('❌ MONGO_URI is not set in environment variables.');
    }

    mongoose.set('strictQuery', false);

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // 🚫 Stop the server if DB connection fails
  }
};

module.exports = connectToMongo;
