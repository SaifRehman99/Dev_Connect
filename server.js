const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Init express app
const app = express();

//middleware here
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Define Routes
app.use('/api/users', require('./routes/Api/users'));
app.use('/api/auth', require('./routes/Api/auth'));
app.use('/api/profile', require('./routes/Api/profile'));
app.use('/api/posts', require('./routes/Api/posts'));

// Server Static assests in Production
if (process.env.NODE_ENV === 'production') {
  // Set Static Folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
