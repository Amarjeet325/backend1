const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', // Allow your Vite frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


// database connection 
connectDB();
const PORT = process.env.PORT || 3008;

// routes paths
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/post', require('./routes/post'));
app.use('/api/comment', require('./routes/comment'));

app.use("/api/v1", require("./routes/uploadRoutes"));

// error handler middleware
app.use( require('./middleware/errorHandler') );  

app.listen( PORT, () => {
    console.log(`Server listninig on port ${PORT}`);
});