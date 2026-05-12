import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PublicDashboard from "./pages/PublicDashboard";
import TrackComplaint from "./pages/TrackComplaint";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/public" element={<PublicDashboard />} />
        <Route path="/track" element={<TrackComplaint />} />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={user?.role === "admin" ? "/admin-dashboard" : "/citizen-dashboard"} replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <RegisterPage />
            ) : (
              <Navigate to={user?.role === "admin" ? "/admin-dashboard" : "/citizen-dashboard"} replace />
            )
          }
        />

        <Route
          path="/citizen-dashboard"
          element={
            <ProtectedRoute allowedRoles={["citizen"]}>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={!isAuthenticated ? <Navigate to="/login" replace /> : <NotFoundPage />}
        />
      </Routes>

      <ToastContainer
        position="top-right"
        theme="dark"
        autoClose={1000}
        closeOnClick
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        draggable
        closeButton
        toastClassName={(ctx) =>
          `${ctx?.defaultClassName || ""} bg-slate-800 text-white border border-slate-700 rounded-lg shadow-lg`
        }
        bodyClassName={(ctx) => `${ctx?.defaultClassName || ""} text-sm`}
        progressClassName={(ctx) => `${ctx?.defaultClassName || ""} bg-blue-500`}
      />
    </AppLayout>
  );
};

export default App;
