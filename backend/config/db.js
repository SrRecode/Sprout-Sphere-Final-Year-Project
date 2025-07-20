const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI not found in environment variables.');
    }
    await mongoose.connect(mongoURI, {
      // Mongoose 6+ doesn't require these options anymore, but keeping for reference
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true, // Not supported
      // useFindAndModify: false // Not supported
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Exit process with failure
    process.exit(1); // Restored exit call
  }
};

module.exports = connectDB; 