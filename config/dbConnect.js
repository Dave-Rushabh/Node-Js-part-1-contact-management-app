const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    const connect = await mongoose.connect(
      process.env.MONGO_DB_CONNECTION_URI,
      { useNewUrlParser: true }
    );
    const {
      connection: { host },
    } = connect;
    console.log('connection to DB is successful at : =>', host);
  } catch (error) {
    console.log('Error while connecting to DB', error);
    process.exit(1);
  }
};

module.exports = connectToDB;
