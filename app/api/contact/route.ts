import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// This API route handles contact form submissions.
// It uses Nodemailer to send emails with the submitted form data.

// Configure the Nodemailer transporter.
// It uses Gmail as the service and authenticates with credentials
// loaded from environment variables (EMAIL_USER and EMAIL_PASS).
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

/**
 * Handles POST requests to the contact form API.
 * Receives name, email, and message from the request body,
 * constructs an email, and sends it using Nodemailer.
 * @param {Request} request - The incoming Next.js API request.
 * @returns {NextResponse} - A JSON response indicating success or failure.
 */
export async function POST(request: Request) {
  try {
    // Parse the request body to extract name, email, and message.
    const { name, email, message } = await request.json();

    // Define mail options for the email to be sent.
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email address
      to: process.env.EMAIL_USER, // Recipient email address (can be the same as sender)
      subject: `New Contact Form Submission from ${name}`, // Email subject line
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `, // HTML content of the email
    };

    // Send the email using the configured transporter.
    await transporter.sendMail(mailOptions);

    // Return a success response if the email was sent successfully.
    return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });
  } catch (error) {
    // Log the error and return an error response if email sending fails.
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send message.', error: (error as Error).message }, { status: 500 });
  }
}