import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all emails
router.get('/', async (req, res) => {
  try {
    const allEmails = await pool.query('SELECT * FROM emails');
    res.json(allEmails.rows);
  } catch (err) {
    console.error('Error fetching emails:', err.message);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// Get emails by recipient
router.get('/recipient/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const emails = await pool.query('SELECT * FROM emails WHERE recipient = $1', [email]);
    res.json(emails.rows);
  } catch (err) {
    console.error('Error fetching emails by recipient:', err.message);
    res.status(500).json({ error: 'Failed to fetch emails by recipient' });
  }
});

// Get emails by sender
router.get('/sender/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const emails = await pool.query('SELECT * FROM emails WHERE sender = $1', [email]);
    res.json(emails.rows);
  } catch (err) {
    console.error('Error fetching emails by sender:', err.message);
    res.status(500).json({ error: 'Failed to fetch emails by sender', message: err.message });
  }
});

// Create a new email
router.post('/', async (req, res) => {
  try {
    const { sender, recipient, subject, body } = req.body;
    const newEmail = await pool.query(
      'INSERT INTO emails (sender, recipient, subject, body) VALUES ($1, $2, $3, $4) RETURNING *',
      [sender, recipient, subject, body]
    );
    res.json({ message: 'Email created successfully', email: newEmail.rows[0] });
  } catch (err) {
    console.error('Error creating email:', err.message);
    res.status(500).json({ error: 'Failed to create email' });
  }
});

// Get a single email
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const email = await pool.query('SELECT * FROM emails WHERE id = $1', [id]);
    if (email.rows.length === 0) {
      res.status(404).json({ error: 'Email not found' });
    } else {
      res.json(email.rows[0]);
    }
  } catch (err) {
    console.error('Error fetching email:', err.message);
    res.status(500).json({ error: 'Failed to fetch email' });
  }
});

// Update an email body
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    const updatedEmail = await pool.query(
      'UPDATE emails SET body = $1 WHERE id = $2 RETURNING *',
      [body, id]
    );
    res.json({ message: 'Email body updated successfully', email: updatedEmail.rows[0] });
  } catch (err) {
    console.error('Error updating email body:', err.message);
    res.status(500).json({ error: 'Failed to update email body' });
  }
});

// Partially update an email
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    const query = {
      text: 'UPDATE emails SET ',
      values: [],
    };

    let i = 1;
    for (const [key, value] of Object.entries(fields)) {
      query.text += `${key} = $${i}, `;
      query.values.push(value);
      i++;
    }
    
    query.text = query.text.slice(0, -2); // Remove trailing comma and space
    query.text += ' WHERE id = $' + i + ' RETURNING *';
    query.values.push(id);

    const updatedEmail = await pool.query(query.text, query.values);
    res.json({ message: 'Email updated successfully', email: updatedEmail.rows[0] });
  } catch (err) {
    console.error('Error updating email:', err.message);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

// Delete an email
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM emails WHERE id = $1', [id]);
    res.json({ message: 'Email deleted successfully' });
  } catch (err) {
    console.error('Error deleting email:', err.message);
    res.status(500).json({ error: 'Failed to delete email' });
  }
});

export default router;
