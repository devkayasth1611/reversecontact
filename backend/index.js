const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path');
const cors = require('cors');

const allowedOrigins = [
    'http://localhost:5173', // Client port (Adjust as per your Vite client port)
    // 'http://localhost:5174'  // Admin port (Adjust as per your Vite admin port)
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  }));

app.use(express.json()); // middleware
app.use(express.urlencoded({ extended: false })); // middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
  .connect("mongodb://127.0.0.1:27017/Linkedin_Details")
  .then((sucess) => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, (err, success) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is running on port=>" + 3000);
  }
});

const mobileEnrichmentRoutes = require('./routes/mobileEnrichmentRoutes')
app.use('/mobileEnrichments', mobileEnrichmentRoutes)

const userRoutes = require('./routes/userRoutes')
app.use('/users', userRoutes)