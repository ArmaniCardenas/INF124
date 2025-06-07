import { Server, Socket } from 'socket.io';
import DocumentModel from '../database/models/documentModel';
import jwt from 'jsonwebtoken';
// import cookie from 'cookie';
const cookie = require('cookie');


export const registerDocumentSocket = (io: Server) => {

  io.use((socket, next) => {
    // console.log('👋 Socket middleware started');

    const cookieHeader = socket.handshake.headers.cookie;
    // console.log('🍪 Raw cookie:', cookieHeader);

    if (!cookieHeader) {
      console.log('❌ No cookies found');
      return next(new Error('No cookies found'));
    }

    let parsedCookies;
    try {
      parsedCookies = cookie.parse(cookieHeader);
    } catch (err) {
      console.error('❌ Failed to parse cookies:', err);
      return next(new Error('Cookie parse failed'));
    }

    // console.log('✅ Parsed cookies:', parsedCookies);

    const token = parsedCookies.token;
    if (!token) {
      console.log('❌ Token not found in cookies');
      return next(new Error('Token not found'));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
      socket.data.user = payload;
      // console.log('✅ Authenticated user:', payload);
      next();
    } catch (err) {
      console.error('❌ Invalid token:', err);
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', socket => {
    const user = socket.data.user;

    // console.log('a user connected');

    socket.on('join-document', async ({ docId }) => {
      // console.log('finding doc and collaborater');

      const doc = await DocumentModel.findById(docId).populate('collaborators.userId');
      if (!doc){
        console.log('no doc found');
        return socket.emit('error', 'Document not found');
      } 
      const collaborator = doc.collaborators.find(c =>
        c.userId._id.toString() === user.id.toString()
      );

      if (!collaborator) {
        console.log('no found collaborator permission for user')
        return socket.emit('permission-denied', 'You are not a collaborator');
      }
      socket.join(docId);
      socket.data.docRole = collaborator.role;
    });

    socket.on('send-changes', ({ docId, delta }) => {
      if (socket.data.docRole !== 'editor' && socket.data.docRole !== 'owner') {
        return socket.emit('permission-denied', 'You do not have edit permissions');
      }

      socket.to(docId).emit('receive-changes', delta);
    });

    socket.on('save-document', async ({ docId, content }) => {
       if (socket.data.docRole !== 'editor' && socket.data.docRole !== 'owner') {
        return socket.emit('permission-denied', 'You do not have permission to save'); 
      }

      try {
        await DocumentModel.findByIdAndUpdate(docId, { content });
      } catch (err) {
        console.error('Save failed:', err);
        socket.emit('save-error', { message: 'Failed to save document' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
    
  });
};
