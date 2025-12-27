# Thazema Video/Audio Calling App - Requirements

## Overview
Thazema is a MERN stack video and audio calling application with real-time communication, AI assistant, and admin panel features. Created by Abebe Mesfin.

## User Stories

### Authentication
- As a user, I want to register with email/password so I can create an account
- As a user, I want to login with email/password so I can access the app
- As a user, I want to login with phone number + OTP so I can use mobile authentication
- As an admin, I want to login with admin credentials (abebemesfin53@gmail.com) to access admin features

### Video/Audio Calling
- As a user, I want to make video calls to my contacts
- As a user, I want to make audio calls to my contacts
- As a user, I want to join group calls with multiple participants
- As a user, I want to see my call history

### Contacts & Discovery
- As a user, I want to manage my contacts list
- As a user, I want to discover nearby users based on location
- As a user, I want to see online/offline status of contacts

### Messaging
- As a user, I want to send text messages to contacts
- As a user, I want to see message history

### Thazema AI Assistant
- As a user, I want to ask the AI any question and get answers
- As a user, I want the AI to search online for information it doesn't know
- As a user, I want to use voice input to talk to the AI
- As a user, I want the AI to speak responses (TTS)
- As a user, I want to switch between male/female voice
- As a user, I want to use the AI in multiple languages (English, Amharic, Arabic, French, Spanish, Chinese, Hindi, Portuguese, Russian, Japanese)
- As an admin, I want to use AI commands to manage users (block/unblock/delete)

### Admin Panel
- As an admin, I want to view user analytics (total users, active users, calls, messages)
- As an admin, I want to manage users (view, block, unblock, delete)
- As an admin, I want to send push notifications to all users
- As an admin, I want to configure app settings

## Acceptance Criteria

### Authentication
- [x] Email/password login works
- [x] Phone OTP login works
- [x] JWT tokens are generated and validated
- [x] Admin login grants admin privileges

### Calling Features
- [x] WebRTC video calls work between users
- [x] Audio-only calls work
- [x] Group calls support multiple participants
- [x] Call history is recorded

### AI Assistant
- [x] AI responds to greetings in multiple languages
- [x] AI answers questions from knowledge base
- [x] AI searches Wikipedia and DuckDuckGo for unknown topics
- [x] AI fetches real-time weather data
- [x] AI performs math calculations
- [x] AI generates passwords, tells jokes, gives quotes
- [x] Voice input works (Chrome)
- [x] TTS output works with male/female toggle
- [x] 10 languages supported including Amharic

### Admin Panel
- [x] Dashboard shows analytics
- [x] User management table with actions
- [x] Notification sending works
- [x] Settings panel available

## Technical Stack
- Frontend: React.js with CSS
- Backend: Node.js + Express
- Real-time: Socket.io + WebRTC
- Database: MongoDB (optional, in-memory for demo)
- Mobile: Capacitor for Android APK
- Theme: Water blue (#0ea5e9) and green (#10b981)

## Current Status
- Core app: ✅ Complete
- Admin panel: ✅ Complete
- Thazema AI: ✅ Complete (custom-built, no external APIs required)
- Mobile APK: ✅ Built with Capacitor
- Server deployment: 🔄 Using localtunnel (needs permanent hosting)

## Next Steps
1. Deploy server to Railway/Render for permanent hosting
2. Update API config with permanent URL
3. Rebuild APK with production URL
4. Test on mobile device
5. Publish to Play Store
