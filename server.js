const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const Datastore = require('nedb');

const app = express();
const port = 3000;

// Database setup
const usersDb = new Datastore({ filename: 'users.db', autoload: true });
const journalsDb = new Datastore({ filename: 'journals.db', autoload: true });
const todosDb = new Datastore({ filename: 'todos.db', autoload: true });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Authentication middleware
const authenticateUser = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Routes
// Register
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    
    usersDb.findOne({ username }, (err, user) => {
        if (user) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ error: 'Error hashing password' });
            
            const newUser = { username, password: hash };
            usersDb.insert(newUser, (err, user) => {
                if (err) return res.status(500).json({ error: 'Error creating user' });
                res.status(201).json({ message: 'User created successfully' });
            });
        });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    usersDb.findOne({ username }, (err, user) => {
        if (!user) return res.status(400).json({ error: 'User not found' });
        
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) return res.status(500).json({ error: 'Error comparing passwords' });
            if (!match) return res.status(400).json({ error: 'Invalid password' });
            
            req.session.userId = user._id;
            res.json({ message: 'Logged in successfully' });
        });
    });
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

// Journal entries
app.post('/api/journals', authenticateUser, (req, res) => {
    const { content, mood, category } = req.body;
    const journalEntry = {
        userId: req.session.userId,
        content,
        mood,
        category,
        date: new Date()
    };
    
    journalsDb.insert(journalEntry, (err, entry) => {
        if (err) return res.status(500).json({ error: 'Error creating journal entry' });
        res.status(201).json(entry);
    });
});

app.get('/api/journals', authenticateUser, (req, res) => {
    journalsDb.find({ userId: req.session.userId }, (err, entries) => {
        if (err) return res.status(500).json({ error: 'Error fetching journal entries' });
        res.json(entries);
    });
});

app.put('/api/journals/:id', authenticateUser, (req, res) => {
    const { content, mood, category } = req.body;
    journalsDb.update(
        { _id: req.params.id, userId: req.session.userId },
        { $set: { content, mood, category } },
        {},
        (err, numAffected) => {
            if (err) return res.status(500).json({ error: 'Error updating journal entry' });
            if (numAffected === 0) return res.status(404).json({ error: 'Journal entry not found' });
            res.json({ message: 'Journal entry updated successfully' });
        }
    );
});

app.delete('/api/journals/:id', authenticateUser, (req, res) => {
    journalsDb.remove({ _id: req.params.id, userId: req.session.userId }, {}, (err, numRemoved) => {
        if (err) return res.status(500).json({ error: 'Error deleting journal entry' });
        if (numRemoved === 0) return res.status(404).json({ error: 'Journal entry not found' });
        res.json({ message: 'Journal entry deleted successfully' });
    });
});

// Todo items
app.post('/api/todos', authenticateUser, (req, res) => {
    const { title, completed, dueDate, importance } = req.body;
    const todo = {
        userId: req.session.userId,
        title,
        completed: completed || false,
        dueDate: dueDate || null,
        importance: importance || 'medium',
        date: new Date()
    };
    
    todosDb.insert(todo, (err, item) => {
        if (err) return res.status(500).json({ error: 'Error creating todo item' });
        res.status(201).json(item);
    });
});

app.get('/api/todos', authenticateUser, (req, res) => {
    todosDb.find({ userId: req.session.userId }, (err, items) => {
        if (err) return res.status(500).json({ error: 'Error fetching todo items' });
        res.json(items);
    });
});

app.put('/api/todos/:id', authenticateUser, (req, res) => {
    const { title, completed, dueDate, importance } = req.body;
    todosDb.update(
        { _id: req.params.id, userId: req.session.userId },
        { $set: { title, completed, dueDate, importance } },
        {},
        (err, numAffected) => {
            if (err) return res.status(500).json({ error: 'Error updating todo item' });
            if (numAffected === 0) return res.status(404).json({ error: 'Todo item not found' });
            res.json({ message: 'Todo item updated successfully' });
        }
    );
});

app.delete('/api/todos/:id', authenticateUser, (req, res) => {
    todosDb.remove({ _id: req.params.id, userId: req.session.userId }, {}, (err, numRemoved) => {
        if (err) return res.status(500).json({ error: 'Error deleting todo item' });
        if (numRemoved === 0) return res.status(404).json({ error: 'Todo item not found' });
        res.json({ message: 'Todo item deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 