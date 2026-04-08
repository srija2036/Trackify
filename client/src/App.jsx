import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TimerProvider } from './context/TimerContext';
import PageWrapper from './components/PageWrapper';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Invoices from './pages/Invoices';
import Forgot from './pages/Forgot';

const Protected = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  const LocationRoutes = () => {
    const location = useLocation();
    return (
      <div className="app-frame">
        <PageWrapper location={location}>
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/projects" element={<Protected><Projects /></Protected>} />
            <Route path="/projects/:id" element={<Protected><ProjectDetail /></Protected>} />
            <Route path="/invoices" element={<Protected><Invoices /></Protected>} />
          </Routes>
        </PageWrapper>
      </div>
    );
  };

  return (
    <AuthProvider>
      <TimerProvider>
        <BrowserRouter>
          <LocationRoutes />
        </BrowserRouter>
      </TimerProvider>
    </AuthProvider>
  );
}