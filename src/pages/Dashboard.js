import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({
    roomId: '',
    startTime: '',
    endTime: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/rooms`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRooms(res.data);
    } catch (err) {
      console.error('Error loading rooms:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(res.data);
    } catch (err) {
      console.error('Error loading bookings:', err);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/bookings`, newBooking, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewBooking({ roomId: '', startTime: '', endTime: '' });
      fetchBookings();
    } catch (err) {
      alert('Bokning misslyckades');
      console.error('Error creating booking:', err);
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchBookings();
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <button onClick={handleLogout}>Logga ut</button>
      <h2>Dashboard</h2>

      <form onSubmit={handleCreateBooking}>
        <h4>Skapa ny bokning</h4>
        <select
          value={newBooking.roomId}
          onChange={e => setNewBooking({ ...newBooking, roomId: e.target.value })}
          required
        >
          <option value="">Välj rum</option>
          {rooms.map(room => (
            <option key={room._id} value={room._id}>
              {room.name} ({room.type})
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={newBooking.startTime}
          onChange={e => setNewBooking({ ...newBooking, startTime: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={newBooking.endTime}
          onChange={e => setNewBooking({ ...newBooking, endTime: e.target.value })}
          required
        />
        <button type="submit">Boka</button>
      </form>

      <h3>Dina Bokningar</h3>
      <ul>
        {bookings.map(booking => (
          <li key={booking._id}>
            {new Date(booking.startTime).toLocaleString()} – {new Date(booking.endTime).toLocaleString()}<br />
            Rum: {booking.roomId?.name || booking.roomId}
            <br />
            <button onClick={() => handleDeleteBooking(booking._id)}>Avboka</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
