const express = require('express');

const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');


const app = express();
app.use(express.json());

app.use(cors({ origin: true, credentials: true }));


// database connection 
connectDB();
const PORT = process.env.PORT || 3008;

// routes paths
app.use('/v1/auth', require('./routes/auth'));
app.use('/v1/user', require('./routes/user'));
app.use('/v1/post', require('./routes/post'));
app.use('/v1/comment', require('./routes/comment'));



app.listen( PORT, () => {
    console.log(`Server listninig on port ${PORT}`);
});