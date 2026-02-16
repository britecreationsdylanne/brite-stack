const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const { Storage } = require('@google-cloud/storage');

const app = express();
const storage = new Storage();
const BUCKET_NAME = 'brite-pulse-ideas';

// Enable CORS for all origins (Cloud Run handles auth)
app.use(cors());

app.use(express.json());

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- Helpers ---

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

async function readIdea(id) {
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(`ideas/${id}.json`);
  const [exists] = await file.exists();
  if (!exists) return null;
  const [contents] = await file.download();
  return JSON.parse(contents.toString());
}

async function writeIdea(id, data) {
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(`ideas/${id}.json`);
  await file.save(JSON.stringify(data, null, 2), {
    contentType: 'application/json',
  });
}

// --- Email endpoint (unchanged) ---

app.post('/send-tool-request', async (req, res) => {
  try {
    const { toolName, description, requesterName, userName, userEmail } = req.body;

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

// --- Ideas CRUD (GCS-backed) ---

// GET /ideas - List all ideas
app.get('/ideas', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const [files] = await bucket.getFiles({ prefix: 'ideas/' });

    const ideas = await Promise.all(
      files
        .filter((f) => f.name.endsWith('.json'))
        .map(async (f) => {
          const [contents] = await f.download();
          return JSON.parse(contents.toString());
        })
    );

    // Sort by createdAt descending (newest first)
    ideas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Return ideas without embedded comments for lighter payload
    const summaries = ideas.map(({ comments, upvotes, ...rest }) => rest);

    res.json({ success: true, ideas: summaries });
  } catch (error) {
    console.error('List ideas error:', error);
    res.status(500).json({ success: false, error: 'Failed to load ideas.' });
  }
});

// POST /ideas - Create a new idea
app.post('/ideas', async (req, res) => {
  try {
    const { toolName, description, requesterName, requesterEmail } = req.body;

    if (!toolName || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: toolName and description'
      });
    }

    const id = generateId();
    const idea = {
      id,
      toolName,
      description,
      requesterName: requesterName || 'Unknown',
      requesterEmail: requesterEmail || 'unknown@brite.co',
      status: 'new',
      createdAt: new Date().toISOString(),
      upvoteCount: 0,
      commentCount: 0,
      updateCount: 0,
      upvotes: {},
      comments: [],
    };

    await writeIdea(id, idea);

    console.log(`Idea created in GCS: ${id} - ${toolName}`);
    res.json({ success: true, idea });
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({ success: false, error: 'Failed to create idea.' });
  }
});

// GET /ideas/:id - Get a single idea with comments
app.get('/ideas/:id', async (req, res) => {
  try {
    const idea = await readIdea(req.params.id);
    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found.' });
    }
    res.json({ success: true, idea });
  } catch (error) {
    console.error('Get idea error:', error);
    res.status(500).json({ success: false, error: 'Failed to load idea.' });
  }
});

// Status display labels for emails
const STATUS_LABELS = {
  'new': 'New',
  'in-progress': 'In Progress',
  'completed': 'Completed',
  'under-review': 'Under Review',
  'planned': 'Planned',
  'building': 'Building',
  'launched': 'Launched',
  'declined': 'Declined',
};

// PUT /ideas/:id/status - Update idea status
app.put('/ideas/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Missing status field.' });
    }

    const idea = await readIdea(req.params.id);
    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found.' });
    }

    const previousStatus = idea.status;
    idea.status = status;
    idea.updateCount = (idea.updateCount || 0) + 1;

    await writeIdea(req.params.id, idea);

    // Email the requester about the status change (fire-and-forget)
    if (idea.requesterEmail && previousStatus !== status) {
      const statusLabel = STATUS_LABELS[status] || status;
      const prevLabel = STATUS_LABELS[previousStatus] || previousStatus;

      const msg = {
        to: idea.requesterEmail,
        from: {
          email: 'marketing@brite.co',
          name: 'BritePulse'
        },
        subject: `Your idea "${idea.toolName}" is now ${statusLabel}`,
        text: `Hi ${idea.requesterName || 'there'},

Great news! Your tool idea "${idea.toolName}" has been updated.

Status changed: ${prevLabel} → ${statusLabel}

Thanks for contributing to BriteStack!

---
Sent from BritePulse`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <p>Hi ${idea.requesterName || 'there'},</p>

            <p>Great news! Your tool idea has been updated.</p>

            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Idea:</strong> ${idea.toolName}</p>
              <p style="margin: 0;"><strong>Status:</strong> ${prevLabel} → <strong>${statusLabel}</strong></p>
            </div>

            <p>Thanks for contributing to BriteStack!</p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">Sent from BritePulse</p>
          </div>
        `
      };

      sgMail.send(msg).catch((err) => {
        console.error('Status update email error (non-blocking):', err);
      });
    }

    console.log(`Idea ${req.params.id} status updated to: ${status}`);
    res.json({ success: true, idea });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, error: 'Failed to update status.' });
  }
});

// POST /ideas/:id/upvote - Toggle upvote
app.post('/ideas/:id/upvote', async (req, res) => {
  try {
    const { userEmail, userName } = req.body;
    if (!userEmail) {
      return res.status(400).json({ success: false, error: 'Missing userEmail.' });
    }

    const idea = await readIdea(req.params.id);
    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found.' });
    }

    if (!idea.upvotes) idea.upvotes = {};

    let hasUpvoted;
    if (idea.upvotes[userEmail]) {
      // Remove upvote
      delete idea.upvotes[userEmail];
      idea.upvoteCount = Math.max(0, (idea.upvoteCount || 0) - 1);
      hasUpvoted = false;
    } else {
      // Add upvote
      idea.upvotes[userEmail] = { userName: userName || 'Unknown', createdAt: new Date().toISOString() };
      idea.upvoteCount = (idea.upvoteCount || 0) + 1;
      hasUpvoted = true;
    }

    await writeIdea(req.params.id, idea);

    res.json({ success: true, hasUpvoted, upvoteCount: idea.upvoteCount });
  } catch (error) {
    console.error('Upvote error:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle upvote.' });
  }
});

// POST /ideas/:id/comments - Add a comment
app.post('/ideas/:id/comments', async (req, res) => {
  try {
    const { text, authorName, authorEmail } = req.body;
    if (!text || !authorEmail) {
      return res.status(400).json({ success: false, error: 'Missing text or authorEmail.' });
    }

    const idea = await readIdea(req.params.id);
    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found.' });
    }

    if (!idea.comments) idea.comments = [];

    const comment = {
      id: generateId(),
      text,
      authorName: authorName || 'Unknown',
      authorEmail,
      createdAt: new Date().toISOString(),
    };

    idea.comments.push(comment);
    idea.commentCount = idea.comments.length;

    await writeIdea(req.params.id, idea);

    res.json({ success: true, comment, commentCount: idea.commentCount });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, error: 'Failed to add comment.' });
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
