const socketio = require('socket.io');
const Message = require('./models/Message');
const User = require('./models/User');
const axios = require('axios');

let io;

function initializeSocket(server) {
    io = socketio(server);

    io.on('connection', (socket) => {
        console.log('New WebSocket connection');

        socket.on('disconnect', async () => {
            // Update user's online status to 'AVAILABLE' when they disconnect
            await updateUserOnlineStatus(socket, 'AVAILABLE');
        });

        socket.on('send-message', async (data) => {
            const { senderId, recipientId, content } = data;

            try {
                // Save message to MongoDB
                const message = new Message({ sender: senderId, recipient: recipientId, content });
                await message.save();

                // Emit message to sender
                io.to(socket.id).emit('receive-message', message);

                // Emit message to recipient if online
                const recipient = await User.findById(recipientId);
                if (recipient.onlineStatus === 'AVAILABLE') {
                    io.to(recipientId).emit('receive-message', message);
                } else if (recipient.onlineStatus === 'BUSY') {
                    // Generate response using language model API
                    const response = await generateResponse(content);

                    // Emit response to sender and recipient
                    io.to(socket.id).emit('receive-message', { sender: recipientId, content: response });
                    io.to(recipientId).emit('receive-message', { sender: senderId, content: response });
                }
            } catch (err) {
                console.error(err.message);
            }
        });
    });
}

async function updateUserOnlineStatus(socket, status) {
    const userId = socket.handshake.auth.userId;

    try {
        await User.findByIdAndUpdate(userId, { onlineStatus: status });
    } catch (err) {
        console.error(err.message);
    }
}

async function generateResponse(content) {
    try {
        const response = await axios.post('language_model_api_url', { content });
        return response.data;
    } catch (err) {
        console.error(err.message);
        return "Sorry, the user is currently unavailable.";
    }
}

module.exports = { initializeSocket, updateUserOnlineStatus };
