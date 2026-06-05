import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PagesPage from './pages/PagesPage';
import PageEditorPage from './pages/PageEditorPage';
import MenusPage from './pages/MenusPage';
import MediaPage from './pages/MediaPage';
import { useAuth } from './auth/AuthContext';

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <Protected>
              <AdminLayout />
            </Protected>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="pages" element={<PagesPage />} />
          <Route path="pages/:id" element={<PageEditorPage />} />
          <Route path="menus" element={<MenusPage />} />
          <Route path="media" element={<MediaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
