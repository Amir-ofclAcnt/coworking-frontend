import { useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketListener = () => {
  useEffect(() => {
    const socket = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('token') }
    });

    socket.on('bookingCreated', data => console.log('🔔 Ny bokning skapad:', data));
    socket.on('bookingUpdated', data => console.log('✏️ Bokning uppdaterad:', data));
    socket.on('bookingDeleted', data => console.log('❌ Bokning borttagen:', data));

    return () => socket.disconnect();
  }, []);

  return null;
};

export default SocketListener;