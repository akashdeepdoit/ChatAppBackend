const express = require('express');

const router = express.Router();

app.post('/api/messages/send', (req, res) => {
    const { senderId, recipientId, content } = req.body;
    
    const message = new Message({
        sender: senderId,
        recipient: recipientId,
        content: content
    });
    message.save()
        .then(savedMessage => {
            
            io.emit('message', savedMessage);
            res.status(200).json({ success: true, message: 'Message sent successfully' });
        })
        .catch(err => {
            console.error('Error saving message:', err);
            res.status(500).json({ success: false, error: 'Failed to send message' });
        });
});



app.get('/api/messages', (req, res) => {
    const { userId } = req.query;

    Message.find({ $or: [{ sender: userId }, { recipient: userId }] })
        .populate('sender')
        .populate('recipient')
        .sort({ createdAt: 'asc' })
        .then(messages => {
            res.status(200).json({ success: true, messages: messages });
        })
        .catch(err => {
            console.error('Error retrieving messages:', err);
            res.status(500).json({ success: false, error: 'Failed to retrieve messages' });
        });
});


module.exports = router;