require('dotenv').config();
const mongoose = require('mongoose');
const Submission = require('./models/Submission');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB.');

    const submissions = await Submission.find().sort({ submittedAt: -1 }).limit(5);
    console.log('Last 5 submissions:');
    console.log(JSON.stringify(submissions, null, 2));

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
