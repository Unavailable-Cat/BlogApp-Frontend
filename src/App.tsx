import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import { ToastProvider } from './components/Toast';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomeFeed } from './pages/HomeFeed';
import { BlogDetail } from './pages/BlogDetail';
import { UserBlogs } from './pages/UserBlogs';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { OAuthCallback } from './pages/OAuthCallback';
import { MyBlogs } from './pages/MyBlogs';
import { CreateBlog } from './pages/CreateBlog';
import { EditBlog } from './pages/EditBlog';
import { Settings } from './pages/Settings';
import { UserProfile } from './pages/UserProfile';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomeFeed />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/user/:username" element={<UserBlogs />} />
              <Route path="/profile/:username" element={<UserProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/oauth2/redirect" element={<OAuthCallback />} />

              {/* Protected routes */}
              <Route
                path="/my-blogs"
                element={
                  <ProtectedRoute>
                    <MyBlogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog/new"
                element={
                  <ProtectedRoute>
                    <CreateBlog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditBlog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
