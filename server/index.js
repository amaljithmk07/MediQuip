const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const server = express();
const mongoose = require('mongoose');
const adminroutes = require('./Routes/adminroutes');
const registerroutes = require('./Routes/registerroutes');
const cors = require('cors');
const userroutes = require('./Routes/userroutes');
const volunteerroutes = require('./Routes/volunteerroutes');
require('dotenv').config();
console.log(process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('database connected');
  })
  .catch((err) => {
    console.log(err);
  });
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

server.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

// Rate Limiting for Auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

const authRoutes = require('./auth/auth.routes');

server.use('/api/auth', authLimiter, authRoutes);
server.use('/api/register', authLimiter, registerroutes);
server.use('/api/admin', adminroutes);
server.use('/api/user', userroutes);
server.use('/api/volunteer', volunteerroutes);

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`server started on port ${port}`);
});

const startReservationWorker = require('./workers/reservationTimeout');
startReservationWorker();
