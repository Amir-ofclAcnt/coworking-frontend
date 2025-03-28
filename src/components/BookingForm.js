import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingForm = () => {
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/rooms', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setRooms(res.data);
        if (res.data.length > 0) setRoomId(res.data[0]._id);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      }
    };
    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        roomId,
        startTime,
        endTime
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Bokning skapad!');
    } catch (err) {
      alert('Bokning misslyckades');
    }
  };

  return (
    <div>
      <h3>Boka rum</h3>
      <form onSubmit={handleSubmit}>
        <select value={roomId} onChange={e => setRoomId(e.target.value)} required>
          {rooms.map(room => (
            <option key={room._id} value={room._id}>
              {room.name} – {room.type} ({room.capacity} pers)
            </option>
          ))}
        </select>
        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
        <button type="submit">Boka</button>
      </form>
    </div>
  );
};

export default BookingForm;