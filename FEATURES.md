# Thazema Features Documentation

## 🎨 Color Scheme

Thazema uses a modern water-inspired color palette:

### Primary Colors
- **Water Blue**: #0ea5e9 - Main brand color
- **Ocean Green**: #10b981 - Secondary brand color
- **Teal Accent**: #06b6d4 - Accent highlights

### Gradients
- Primary: Blue to Green (135deg)
- Ocean: Blue → Teal → Green (multi-stop)
- Water: Vertical blue to green flow

## 🎯 Button System

### Button Types

1. **Primary Buttons** (`.btn-primary`)
   - Blue-green gradient background
   - Used for main actions (Login, Register, Call)
   - Hover: Lift effect with enhanced shadow

2. **Secondary Buttons** (`.btn-secondary`)
   - Transparent with blue border
   - Hover: Fills with blue gradient

3. **Success Buttons** (`.btn-success`)
   - Green gradient
   - Used for positive actions (Accept call, Confirm)

4. **Danger Buttons** (`.btn-danger`)
   - Red gradient
   - Used for destructive actions (End call, Reject, Delete)

5. **Icon Buttons** (`.btn-icon`)
   - Circular buttons with icons
   - Available in primary, success, and danger variants
   - Hover: Scale and rotate animation

### Button Sizes
- Small: `.btn-sm` - Compact size
- Default: Standard size
- Large: `.btn-lg` - Prominent actions

### Button Modifiers
- `.btn-outline` - Outline style
- `.btn-rounded` - Fully rounded corners
- `.btn-pulse` - Pulsing animation
- `.btn-glow` - Ripple effect on hover

## 📍 Location Features

### Nearby Users
- **Geolocation**: Uses browser's geolocation API
- **Distance Calculation**: Shows distance in kilometers
- **Radius Search**: Default 50km, customizable
- **Real-time Updates**: Location updates on user movement

### How It Works
1. User grants location permission
2. App fetches current coordinates
3. Backend queries MongoDB with geospatial index
4. Returns users within specified radius
5. Displays distance for each user

### Privacy
- Location stored in database for matching
- Only approximate distance shown to others
- Can be disabled in settings

## 🎨 UI Components

### Contact Cards
- Avatar with gradient background
- Username and status indicator
- Distance badge (for nearby users)
- Quick action buttons (audio/video call)
- Hover effects with elevation

### Status Indicators
- **Online**: Green with glow effect
- **Offline**: Gray
- **Busy**: Red with glow
- **Away**: Yellow/orange with glow

### Call Controls
- Mute/Unmute microphone
- Video on/off toggle
- End call button
- Screen share (coming soon)
- Call duration timer

## 🔧 Technical Features

### WebRTC Implementation
- Peer-to-peer connections
- STUN servers for NAT traversal
- ICE candidate exchange
- Offer/Answer SDP negotiation

### Socket.io Events
- `user:join` - User connects
- `call:initiate` - Start call
- `call:answer` - Accept call
- `call:reject` - Decline call
- `call:end` - End call
- `ice:candidate` - Exchange ICE candidates
- `user:online/offline` - Status updates

### Database Schema

#### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  avatar: String,
  status: Enum ['online', 'offline', 'busy', 'away'],
  contacts: [ObjectId],
  socketId: String,
  location: {
    type: 'Point',
    coordinates: [longitude, latitude]
  }
}
```

#### Call Model
```javascript
{
  caller: ObjectId,
  receiver: ObjectId,
  type: Enum ['audio', 'video'],
  status: Enum ['missed', 'received', 'rejected', 'completed'],
  duration: Number,
  startTime: Date,
  endTime: Date
}
```

## 🎭 Animations

### Button Animations
- Hover lift effect
- Ripple effect on click
- Pulse animation for notifications
- Rotate on hover (icon buttons)

### Card Animations
- Slide up on mount
- Fade in effect
- Hover elevation
- Border glow on hover

### Transition Effects
- Smooth page transitions
- Modal fade in/out
- Tab switching animation
- Loading spinners

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Optimizations
- Touch-friendly button sizes
- Simplified navigation
- Stacked layouts
- Hidden labels (icon-only buttons)

## 🔐 Security Features

- JWT authentication
- Password hashing (bcrypt)
- HTTPS required for WebRTC
- Input validation
- XSS protection
- CORS configuration

## 🚀 Performance

- Lazy loading components
- Optimized images
- Minimal bundle size
- Efficient re-renders
- WebSocket connection pooling

## 📊 Future Enhancements

- [ ] Group video calls
- [ ] Screen sharing
- [ ] In-call chat
- [ ] File sharing
- [ ] Call recording
- [ ] Push notifications
- [ ] End-to-end encryption
- [ ] Virtual backgrounds
- [ ] Noise cancellation
- [ ] Mobile apps (React Native)

## 🎨 Customization

### Theme Variables
All colors are defined in CSS variables and can be customized in `client/src/styles/colors.css`

### Button Styles
Button styles are modular and can be extended in `client/src/styles/buttons.css`

### Component Styling
Each component has its own CSS file for easy customization

## 📞 Administrator Contact

**Name**: Abebe  
**Phone**: +251 914 319 513  
**Email**: abebemesfin53@gmail.com

For support, feature requests, or bug reports, contact the administrator.
