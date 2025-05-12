# Daily Journal App

A simple daily journal application that allows users to write journal entries and manage their todo list. Built with HTML, CSS, JavaScript, Node.js, Express.js, and NeDB.

## Live Demo

[View Live Demo](https://gunjan275.github.io/finalproject/)

## Features

- User authentication (register/login)
- Write and manage daily journal entries
- Add mood and category to journal entries
- Create and manage todo list with:
  - Due dates
  - Importance levels (Low, Medium, High)
  - Completion status
- Edit and delete functionality for both journal entries and todos
- Responsive design for all devices

## Screenshots

[Add screenshots of your application here]

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gunjan275/finalproject.git
cd finalproject
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
3. Add and manage your todo list:
   - Set due dates
   - Mark importance levels
   - Track completion status
4. Edit or delete entries and todos as needed

## Project Structure

```
finalproject/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js
├── package.json
└── README.md
```

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Gunjan Basnet - [@gunjan275](https://github.com/gunjan275)

Project Link: [https://github.com/gunjan275/finalproject](https://github.com/gunjan275/finalproject) 