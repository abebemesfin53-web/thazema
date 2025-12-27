const User = require('../models/User');
const Call = require('../models/Call');

// Store active users and their socket connections
const activeUsers = new Map();

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // User joins with their ID
    socket.on('user:join', async (userId) => {
      try {
        activeUsers.set(userId, socket.id);
        socket.userId = userId;
        
        // Update user status
        await User.findByIdAndUpdate(userId, { 
          status: 'online',
          socketId: socket.id 
        });
        
        // Notify others about online status
        socket.broadcast.emit('user:online', { userId });
        
        console.log(`✅ User ${userId} joined`);
      } catch (error) {
        console.error('Error in user:join:', error);
      }
    });

    // Call initiation
    socket.on('call:initiate', async ({ callerId, receiverId, type, offer }) => {
      try {
        const receiverSocketId = activeUsers.get(receiverId);
        
        if (receiverSocketId) {
          // Create call record
          const call = new Call({
            caller: callerId,
            receiver: receiverId,
            type
          });
          await call.save();
          
          // Send call notification to receiver
          io.to(receiverSocketId).emit('call:incoming', {
            callId: call._id,
            callerId,
            type,
            offer
          });
          
          console.log(`📞 Call initiated: ${callerId} -> ${receiverId}`);
        } else {
          socket.emit('call:error', { message: 'User is offline' });
        }
      } catch (error) {
        console.error('Error in call:initiate:', error);
        socket.emit('call:error', { message: error.message });
      }
    });

    // Call answer
    socket.on('call:answer', ({ callerId, answer }) => {
      const callerSocketId = activeUsers.get(callerId);
      if (callerSocketId) {
        io.to(callerSocketId).emit('call:answered', { answer });
        console.log(`✅ Call answered by ${socket.userId}`);
      }
    });

    // Call rejection
    socket.on('call:reject', async ({ callId, callerId }) => {
      try {
        await Call.findByIdAndUpdate(callId, { status: 'rejected' });
        
        const callerSocketId = activeUsers.get(callerId);
        if (callerSocketId) {
          io.to(callerSocketId).emit('call:rejected');
        }
        
        console.log(`❌ Call rejected: ${callId}`);
      } catch (error) {
        console.error('Error in call:reject:', error);
      }
    });

    // Call end
    socket.on('call:end', async ({ callId, otherUserId, duration }) => {
      try {
        if (callId) {
          await Call.findByIdAndUpdate(callId, {
            status: 'completed',
            duration,
            endTime: new Date()
          });
        }
        
        const otherSocketId = activeUsers.get(otherUserId);
        if (otherSocketId) {
          io.to(otherSocketId).emit('call:ended');
        }
        
        console.log(`📴 Call ended: ${callId}`);
      } catch (error) {
        console.error('Error in call:end:', error);
      }
    });

    // ICE candidate exchange
    socket.on('ice:candidate', ({ targetUserId, candidate }) => {
      const targetSocketId = activeUsers.get(targetUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('ice:candidate', { candidate });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      try {
        if (socket.userId) {
          activeUsers.delete(socket.userId);
          
          await User.findByIdAndUpdate(socket.userId, {
            status: 'offline',
            socketId: null
          });
          
          socket.broadcast.emit('user:offline', { userId: socket.userId });
          console.log(`👋 User ${socket.userId} disconnected`);
        }
      } catch (error) {
        console.error('Error in disconnect:', error);
      }
    });
  });
};

module.exports = { setupSocketHandlers };
