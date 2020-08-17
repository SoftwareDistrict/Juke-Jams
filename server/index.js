require('dotenv').config();
const { PORT } = process.env;
const { app } = require('./app.js');

// Listen for connection
app.listen(PORT, console.log(`Listening on http://localhost:${PORT}`));