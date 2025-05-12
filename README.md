# Daily Journal App

A simple daily journal application that allows users to write journal entries and manage their todo list. Built with HTML, CSS, JavaScript, Node.js, Express.js, and NeDB.

## Features

- User authentication (register/login)
- Write and manage daily journal entries
- Add mood and category to journal entries
- Create and manage todo list
- Mark todos as complete/incomplete
- Delete journal entries and todos
- Responsive design

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd daily-journal-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. Register a new account or login with existing credentials
2. Write journal entries with your thoughts, mood, and category
3. Add and manage your todo list
4. Mark todos as complete when done
5. Delete entries and todos as needed

## Technologies Used

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  
- Backend:
  - Node.js
  - Express.js
  - NeDB (Database)
  - bcrypt (Password hashing)
  - express-session (Session management)

## Security Features

- Password hashing using bcrypt
- Session-based authentication
- Protected routes for authenticated users only
- Input validation
- XSS protection

## License

MIT 