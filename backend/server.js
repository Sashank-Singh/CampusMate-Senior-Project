  // backend/server.js
  const express = require('express');
  const cors = require('cors');
  const bodyParser = require('body-parser');
  const app = express();
  const port = process.env.PORT || 5000;

  app.use(cors());
  app.use(bodyParser.json());

  // Import routes
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });