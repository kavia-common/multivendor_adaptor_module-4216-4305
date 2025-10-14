import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import NavBar from './components/NavBar';
import Notification from './components/Notification';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadModel from './pages/UploadModel';
import ConfigureMapping from './pages/ConfigureMapping';
import ProvisionService from './pages/ProvisionService';
import Status from './pages/Status';
import Versioning from './pages/Versioning';
import AuditLogs from './pages/AuditLogs';

function App() {
  const { isAuthenticated } = useAuth();
  const [notification, setNotification] = useState<{ type: 'success'|'error'|'info'; message: string } | null>(null);

  const handleNotify = (type: 'success'|'error'|'info', message: string) => setNotification({ type, message });
  const clearNotification = () => setNotification(null);

  return (
    <div className="App">
      <NavBar />
      {notification && (
        <Notification type={notification.type} message={notification.message} onClose={clearNotification} />
      )}
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login onNotify={handleNotify} />} />
        <Route element={<ProtectedRoute onNotify={handleNotify} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload-model" element={<UploadModel onNotify={handleNotify} />} />
          <Route path="/configure-mapping" element={<ConfigureMapping onNotify={handleNotify} />} />
          <Route path="/provision-service" element={<ProvisionService onNotify={handleNotify} />} />
          <Route path="/status" element={<Status onNotify={handleNotify} />} />
          <Route path="/versioning" element={<Versioning onNotify={handleNotify} />} />
          <Route path="/audit-logs" element={<AuditLogs onNotify={handleNotify} />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
      </Routes>
    </div>
  );
}

export default App;
