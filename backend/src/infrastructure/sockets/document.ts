import { Server, Socket } from 'socket.io';
import DocumentModel from '../database/models/documentModel';
import jwt from 'jsonwebtoken';
// import cookie from 'cookie';
const cookie = require('cookie');


export const registerDocumentSocket = (io: Server) => {

  // io.use((socket, next) => {
  //   // console.log('cookie:', cookie);
  //   // console.log('cookie.parse:', cookie?.parse?.toString());


  //     console.log('socket.handshake.headers.cookie:', socket.handshake.headers.cookie); 

  //   const cookies = socket.handshake.headers.cookie;
  //   if (!cookies) {
  //         console.log(' No cookies found');

  //     return next(new Error('No cookies found'));
  //   }

  //   const parsedCookies = cookie.parse(cookies);
  //   const token = parsedCookies.token;

  //   if (!token) {
  //     console.log('❌ Token not found in cookies');

  //     return next(new Error('Token not found in cookies'));
  //   }

  //   try {
  //     const payload = jwt.verify(token, process.env.JWT_SECRET!);
  //     socket.data.user = payload;
  //     console.log('here')
  //     next();
  //   } catch (err) {
  //     return next(new Error('Invalid token'));
  //   }
  // });


  io.on('connection', socket => {
    const user = socket.data.user;

    console.log('a user connected');

    socket.on('join-document', async ({ docId }) => {
      // const doc = await DocumentModel.findById(docId).populate('collaborators.userId');
      // if (!doc) return socket.emit('error', 'Document not found');

      // const collaborator = doc.collaborators.find(c =>
      //   c.userId.toString() === user._id.toString()
      // );

      // if (!collaborator) {
      //   return socket.emit('permission-denied', 'You are not a collaborator');
      // }

      socket.join(docId);
      // socket.data.docRole = collaborator.role;
    });

    socket.on('send-changes', ({ docId, delta }) => {
      // if (socket.data.docRole !== 'editor' && socket.data.docRole !== 'owner') {
      //   return socket.emit('permission-denied', 'You do not have edit permissions');
      // }

      socket.to(docId).emit('receive-changes', delta);
    });

    socket.on('save-document', async ({ docId, content }) => {
      //  if (socket.data.docRole !== 'editor' && socket.data.docRole !== 'owner') {
      //   return socket.emit('permission-denied', 'You do not have permission to save');
      // }

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
