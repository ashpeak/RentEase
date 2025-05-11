// This service manages WebSocket connections for real-time notifications
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

// Map to store active connections
const clients = new Map();

// Initialize WebSocket server
const initWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    console.log('WebSocket connection established');
    
    // Extract token from query parameters (req.url)
    let userId = null;
    try {
      const urlParams = new URLSearchParams(req.url.split('?')[1]);
      const token = urlParams.get('token');
      
      if (token) {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.sub; // sub is the Clerk user ID
        
        // Store the connection with the user ID as key
        if (!clients.has(userId)) {
          clients.set(userId, new Set());
        }
        clients.get(userId).add(ws);
        
        console.log(`Client connected: ${userId}`);
      } else {
        console.log('Connection without token rejected');
        ws.close(1008, 'Authentication required');
        return;
      }
    } catch (error) {
      console.error('WebSocket authentication error:', error);
      ws.close(1008, 'Authentication failed');
      return;
    }

    // Handle client messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received:', data);
        
        // Add message handling as needed
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      if (userId && clients.has(userId)) {
        clients.get(userId).delete(ws);
        
        // Clean up if no more connections for this user
        if (clients.get(userId).size === 0) {
          clients.delete(userId);
        }
        
        console.log(`Client disconnected: ${userId}`);
      }
    });
    
    // Send initial connection confirmation
    ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));
  });

  return wss;
};

/**
 * Send a notification to a specific user
 * @param {string} userId - The user ID to send the notification to
 * @param {Object} notification - The notification object to send
 */
const sendNotification = (userId, notification) => {
  if (clients.has(userId)) {
    const userClients = clients.get(userId);
    const message = JSON.stringify({
      type: 'notification',
      data: notification
    });
    
    userClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    
    console.log(`Notification sent to user ${userId}`);
  }
};

/**
 * Broadcast a notification to all connected clients
 * @param {Object} notification - The notification to broadcast
 */
const broadcastNotification = (notification) => {
  const message = JSON.stringify({
    type: 'notification',
    data: notification
  });
  
  clients.forEach((userClients) => {
    userClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  
  console.log('Notification broadcasted to all clients');
};

module.exports = {
  initWebSocketServer,
  sendNotification,
  broadcastNotification
};
