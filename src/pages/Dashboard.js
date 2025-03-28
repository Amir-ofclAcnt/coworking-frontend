import React from 'react';
import RoomList from '../components/RoomList';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <RoomList />
      <BookingForm />
      <BookingList />
    </div>
  );
};

export default Dashboard;
