import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterLogin from './pages/RegisterLogin';
import TestPage from './pages/TestPage';
import EditPage from './pages/EditPage';
import ResultPage from './pages/ResultPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      {/* Global Navbar */}
      <nav className="auth-navbar">
        <img src="/purplezonewt 1.png" alt="purplezone" style={{ height: '26px' }} />
      </nav>

      <Routes>
        {/* Page 1: Always show login/register at root */}
        <Route path="/" element={<RegisterLogin />} />

        {/* Protected pages — require JWT token */}
        <Route element={<ProtectedRoute />}>
          <Route path="/test" element={<TestPage />} />
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
