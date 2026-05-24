const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Kembil Backend is running...");
});

/* CREATE STUDENT + SEND EMAIL */
app.post("/create-student", async (req, res) => {
  const { name, email, password, className } = req.body;

  if (!name || !email || !password || !className) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  try {
    /* EMAIL TRANSPORTER (GMAIL SMTP) */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });

    /* EMAIL CONTENT */
    const mailOptions = {
      from: `"Kembil Schools" <${process.env.EMAIL}>`,
      to: email,
      subject: "Student Account Created Successfully",
      html: `
        <div style="font-family:Segoe UI,sans-serif;padding:20px;">
          
          <h2 style="color:#0056b3;">Kembil Schools</h2>

          <p>Hello <b>${name}</b>,</p>

          <p>Your student account has been created successfully.</p>

          <h3>Login Details</h3>

          <p><b>Email:</b> ${email}</p>
          <p><b>Password:</b> ${password}</p>
          <p><b>Class:</b> ${className}</p>

          <p style="margin-top:20px;">
            Please change your password after first login.
          </p>

          <br/>
          <p>Regards,<br/>Kembil Schools Admin</p>

        </div>
      `
    };

    /* SEND EMAIL */
    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Student created and email sent"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Email sending failed",
      error: error.message
    });
  }
});

/* START SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
