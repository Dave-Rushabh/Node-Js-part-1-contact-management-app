const express = require('express');
const cors = require('cors');
const env = require('dotenv');
const contactRouter = require('./routes/contactRoutes');
const errorHandlingMiddleware = require('./middleware/errorHandlingMiddleware');
const connectToDB = require('./config/dbConnect');
const userRouter = require('./routes/userRoutes');
const app = express();

// handling env variables
env.config({ path: '.env' });

// utilizing in built middleware
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 7777;

// handling contacts API
app.use('/api/contacts', contactRouter);

// handling users API
app.use('/api/users', userRouter);

app.use(errorHandlingMiddleware);

connectToDB();

app.listen(port, () => {
  console.log(`The server has started on PORT =>  ${port}`);
});
