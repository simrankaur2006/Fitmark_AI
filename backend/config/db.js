const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI in the environment.
 * The app is written so it still boots (with history disabled)
 * if MongoDB is unreachable in local/dev environments.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[db] MONGODB_URI not set — skipping database connection.');
    return false;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('[db] MongoDB connected:', mongoose.connection.host);
    return true;
  } catch (err) {
    console.error('[db] MongoDB connection failed:', err.message);
    return false;
  }
}

module.exports = connectDB;
