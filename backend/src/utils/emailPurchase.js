require('dotenv').config();
const nodemailer = require('nodemailer');

// Usa el mismo transportador que ya tienes
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

