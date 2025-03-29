import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editRoomData, setEditRoomData] = useState({ name: '', capacity: '', type: 'workspace' });
  const [newRoom, setNewRoom] = useState({ name: '', capacity: '', type: 'workspace' });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    fetchRooms();
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error loading users:', err);
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

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/rooms`, newRoom, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewRoom({ name: '', capacity: '', type: 'workspace' });
      fetchRooms();
    } catch (err) {
      console.error('Error adding room:', err);
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/rooms/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchRooms();
    } catch (err) {
      console.error('Error deleting room:', err);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoomId(room._id);
    setEditRoomData({ name: room.name, capacity: room.capacity, type: room.type });
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/rooms/${editingRoomId}`, editRoomData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditingRoomId(null);
      setEditRoomData({ name: '', capacity: '', type: 'workspace' });
      fetchRooms();
    } catch (err) {
      console.error('Error updating room:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logga ut</button>
      <h2>Adminpanel – Hantera Rum</h2>

      <form onSubmit={handleAddRoom}>
        <input type="text" placeholder="Namn" value={newRoom.name} onChange={e => setNewRoom({ ...newRoom, name: e.target.value })} required />
        <input type="number" placeholder="Kapacitet" value={newRoom.capacity} onChange={e => setNewRoom({ ...newRoom, capacity: e.target.value })} required />
        <select value={newRoom.type} onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}>
          <option value="workspace">Arbetsplats</option>
          <option value="conference">Konferensrum</option>
        </select>
        <button type="submit">Lägg till rum</button>
      </form>

      <h3>Alla Rum</h3>
      <ul>
        {rooms.map(room => (
          <li key={room._id}>
            {editingRoomId === room._id ? (
              <form onSubmit={handleUpdateRoom}>
                <input value={editRoomData.name} onChange={e => setEditRoomData({ ...editRoomData, name: e.target.value })} required />
                <input type="number" value={editRoomData.capacity} onChange={e => setEditRoomData({ ...editRoomData, capacity: e.target.value })} required />
                <select value={editRoomData.type} onChange={e => setEditRoomData({ ...editRoomData, type: e.target.value })}>
                  <option value="workspace">Arbetsplats</option>
                  <option value="conference">Konferensrum</option>
                </select>
                <button type="submit">Spara</button>
                <button type="button" onClick={() => setEditingRoomId(null)}>Avbryt</button>
              </form>
            ) : (
              <>
                {room.name} – {room.type} ({room.capacity} pers)
                <button onClick={() => handleEditRoom(room)}>Redigera</button>
                <button onClick={() => handleDeleteRoom(room._id)}>Ta bort</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h3>Användare</h3>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.username} ({user.role})
            <button onClick={() => handleDeleteUser(user._id)}>Ta bort</button>
          </li>
        ))}
      </ul>

      <h3>Alla Bokningar</h3>
      <ul>
        {bookings.map(booking => (
          <li key={booking._id}>
            {new Date(booking.startTime).toLocaleString()} – {new Date(booking.endTime).toLocaleString()}<br />
            Användare: {booking.userId?.username || booking.userId}<br />
            Rum: {booking.roomId?.name || booking.roomId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
