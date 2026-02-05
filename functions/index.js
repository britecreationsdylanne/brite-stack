const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();

// Enable CORS for all origins (Cloud Run handles auth)
app.use(cors());

app.use(express.json());

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/send-tool-request', async (req, res) => {
  try {
    const { toolName, description, requesterName, userName, userEmail } = req.body;

    // Validate required fields
    if (!toolName || !description || !userEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: toolName, description, and userEmail are required'
      });
    }

    const displayName = requesterName || userName || 'A BriteStack user';

    const msg = {
      to: ['dylanne.crugnale@brite.co', 'dustin.sitar@brite.co'],
      from: {
        email: 'marketing@brite.co',
        name: 'BritePulse'
      },
      subject: `BriteStack Tool Request: ${toolName}`,
      text: `Hey team,

${displayName} (${userEmail}) has submitted a new tool request:

Tool Name: ${toolName}

Description/Use Case:
${description}

---
Sent from BriteStack`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Hey team,</p>

          <p><strong>${displayName}</strong> (<a href="mailto:${userEmail}">${userEmail}</a>) has submitted a new tool request:</p>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Tool Name:</strong> ${toolName}</p>
            <p style="margin: 0;"><strong>Description/Use Case:</strong></p>
            <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${description}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Sent from BriteStack</p>
        </div>
      `
    };

    await sgMail.send(msg);

    console.log(`Tool request email sent: ${toolName} from ${userEmail}`);
    res.json({ success: true, message: 'Tool request submitted successfully' });

  } catch (error) {
    console.error('SendGrid Error:', error);

    if (error.response) {
      console.error('SendGrid Response Error:', error.response.body);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to send tool request. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'britestack-email-function' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
