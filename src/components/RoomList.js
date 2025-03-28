import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/rooms', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setRooms(res.data);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div>
      <h3>Lediga rum</h3>
      <ul>
        {rooms.map(room => (
          <li key={room._id}>{room.name} – {room.type} ({room.capacity} pers)</li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
