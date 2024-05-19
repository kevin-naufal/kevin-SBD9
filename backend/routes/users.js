import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = await req.pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
    res.json({ message: 'User created successfully', user: newUser.rows[0] }); // Send success message
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
});


// Read all users
router.get('/', async (req, res) => {
  try {
    const allUsers = await req.pool.query('SELECT * FROM users');
    res.json(allUsers.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await req.pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User was deleted!' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    await req.pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id]
    );
    res.json({ message: 'User was updated!' });
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await req.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const match = await bcrypt.compare(password, user.rows[0].password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    // If credentials are valid, return user data
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Error logging in:', err.message);
    res.status(500).json({ error: 'Failed to login' });
  }
});

export default router;
