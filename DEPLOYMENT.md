# Deployment Guide for Thazema

## Prerequisites

- SSL Certificate (required for WebRTC)
- MongoDB database (MongoDB Atlas recommended)
- Node.js hosting platform
- Domain name (optional but recommended)

## Option 1: Deploy to Heroku

### 1. Prepare the Application

Add a Procfile:
```
web: node server/index.js
```

Update `server/index.js` to serve React build:
```javascript
// Add after routes
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}
```

### 2. Build React App
```bash
cd client
npm run build
cd ..
```

### 3. Deploy to Heroku
```bash
heroku create thazema-app
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production
git push heroku main
```

## Option 2: Deploy to AWS EC2

### 1. Launch EC2 Instance
- Choose Ubuntu Server
- Configure security groups (ports 80, 443, 5000)
- Create and download key pair

### 2. Connect and Setup
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt-get install -y mongodb

# Install Nginx
sudo apt-get install -y nginx
```

### 3. Clone and Setup Application
```bash
git clone your-repo-url
cd thazema
npm install
cd client && npm install && npm run build
cd ..
```

### 4. Configure Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Setup SSL with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 6. Use PM2 for Process Management
```bash
sudo npm install -g pm2
pm2 start server/index.js --name thazema
pm2 startup
pm2 save
```

## Option 3: Deploy to DigitalOcean

Similar to AWS EC2, but use DigitalOcean's App Platform for easier deployment:

1. Connect your GitHub repository
2. Configure environment variables
3. Set build command: `cd client && npm run build`
4. Set run command: `node server/index.js`
5. Deploy

## TURN Server Setup (Important for Production)

WebRTC needs TURN servers for NAT traversal. Use coturn:

### Install Coturn
```bash
sudo apt-get install coturn
```

### Configure `/etc/turnserver.conf`
```
listening-port=3478
fingerprint
lt-cred-mech
use-auth-secret
static-auth-secret=your-secret-key
realm=your-domain.com
total-quota=100
stale-nonce=600
cert=/etc/letsencrypt/live/your-domain.com/cert.pem
pkey=/etc/letsencrypt/live/your-domain.com/privkey.pem
```

### Update WebRTC Configuration
```javascript
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:your-domain.com:3478',
      username: 'username',
      credential: 'password'
    }
  ]
};
```

## Environment Variables for Production

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/thazema
JWT_SECRET=very_secure_random_string_here
NODE_ENV=production
CLIENT_URL=https://your-domain.com
```

## MongoDB Atlas Setup

1. Create account at mongodb.com/cloud/atlas
2. Create a cluster
3. Add database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Update MONGODB_URI in environment variables

## Security Checklist

- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] MongoDB authentication enabled
- [ ] Strong JWT secret
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Firewall configured
- [ ] Regular backups scheduled

## Monitoring

### Setup PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Check Logs
```bash
pm2 logs thazema
pm2 monit
```

## Scaling Considerations

For high traffic:
- Use load balancer (Nginx, AWS ELB)
- Implement Redis for Socket.io adapter
- Use SFU (Selective Forwarding Unit) for group calls
- CDN for static assets
- Database read replicas

## Troubleshooting

### WebRTC Not Working
- Verify HTTPS is enabled
- Check TURN server configuration
- Test with different browsers
- Verify firewall rules

### Socket.io Connection Issues
- Check CORS settings
- Verify WebSocket support
- Check proxy configuration

### Performance Issues
- Enable gzip compression
- Optimize database queries
- Use CDN for assets
- Implement caching
