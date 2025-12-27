# Thazema - Real-Time Video & Audio Calling App

A modern, full-stack video and audio calling application built with the MERN stack, WebRTC, and Socket.io.

## Administrator Contact

**Name:** Abebe  
**Phone:** +251 914 319 514  
**Email:** abebemesfin53@gmail.com

## Features

- **Authentication**: JWT-based user authentication with secure login/register
- **Real-Time Calling**: One-to-one video and audio calls using WebRTC
- **Call Management**: Incoming/outgoing call UI with call history
- **Call Controls**: Mute, video on/off, end call functionality
- **Contact System**: View and call other users
- **Real-Time Signaling**: Socket.io for WebRTC handshake and ICE candidate exchange
- **Modern UI**: Clean, responsive interface with dark mode

## Tech Stack

### Frontend
- React.js
- React Router
- Socket.io Client
- WebRTC API
- Axios
- React Icons

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
thazema/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # React context (Auth, Socket)
│       ├── pages/          # Page components
│       └── App.js
├── server/                 # Node.js backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── socket/            # Socket.io handlers
│   ├── middleware/        # Auth middleware
│   └── index.js
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
```bash
npm run install-all
```

2. Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/thazema
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Run the application:
```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

## How It Works

### WebRTC Flow

1. **Peer Connection Setup**: Each call creates an RTCPeerConnection with STUN servers
2. **Offer/Answer Exchange**: Caller creates offer, receiver creates answer
3. **ICE Candidates**: Both peers exchange ICE candidates for NAT traversal
4. **Media Streams**: Local media streams are added to peer connection
5. **Remote Streams**: Remote streams are received via ontrack event

### Socket.io Events

- `user:join` - User connects and registers their socket ID
- `call:initiate` - Caller initiates a call with offer
- `call:answer` - Receiver accepts and sends answer
- `call:reject` - Receiver rejects the call
- `call:end` - Either party ends the call
- `ice:candidate` - Exchange ICE candidates
- `user:online/offline` - Track user status

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/search?q=query` - Search users
- `POST /api/users/contacts/:userId` - Add contact

### Calls
- `GET /api/calls/history` - Get call history
- `POST /api/calls` - Create call record

## Security Best Practices

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- HTTPS required for WebRTC in production
- Environment variables for sensitive data
- Input validation on all endpoints

## Deployment

### Requirements for Production
- HTTPS/SSL certificate (required for WebRTC)
- STUN/TURN servers for better connectivity
- MongoDB Atlas or hosted database
- Node.js hosting (Heroku, AWS, DigitalOcean)

### Deployment Steps

1. Set environment variables on your hosting platform
2. Build the React app:
```bash
cd client && npm run build
```
3. Serve the build folder from Express
4. Configure TURN servers for better NAT traversal
5. Set up SSL certificate (Let's Encrypt)

## Future Enhancements

- Group video calls (mesh or SFU architecture)
- Screen sharing
- In-call chat messaging
- Call recording
- Push notifications
- End-to-end encryption
- File sharing
- Mobile app (React Native)

## Troubleshooting

### Camera/Microphone Access
- Ensure HTTPS in production
- Check browser permissions
- Verify getUserMedia support

### Connection Issues
- Check STUN/TURN server configuration
- Verify firewall settings
- Test with different networks

### Socket Connection
- Verify CORS settings
- Check server URL in client
- Ensure Socket.io versions match

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first.
