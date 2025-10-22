import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ComposeNewPost from './pages/ComposeNewPost';
import Posts from './pages/Posts';
import Feedbacks from './pages/Feedbacks';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/compose" element={<ComposeNewPost />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/feedbacks" element={<Feedbacks />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:userId" element={<UserDetail />} />
    </Routes>
  );
}
