const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
console.log('Loading routes...'); // ADD THIS LINE
app.use('/api/auth', require('./routes/auth'));
console.log('Auth route loaded'); // ADD THIS LINE

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/workorders', require('./routes/workorders'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/', (req, res) => res.send('PMMS Server Running 🔥'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('❌ DB Error:', err));