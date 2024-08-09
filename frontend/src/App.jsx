import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import LandingPage from "./components/landingPage/LandingPage";
import CRMIntegration from "./components/dashboard/CRM";
import Report from "./components/dashboard/Report";
import CreateReport from "./components/dashboard/CreateReport";
import Login from "./auth/Login";
import Register from "./auth/Register";
import DataInBoard from "./components/dashboard/DataInBoard";
import EditReport from "./components/dashboard/EditReport";
import { useAuth } from "./context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewReport from "./components/dashboard/ViewReport";
import ImageUploader from "./components/dashboard/OCR/pages/ImageUploader";
import ImageViewer from "./components/dashboard/OCR/pages/ImageViewer";
import Tables from "./components/dashboard/OCR/pages/Tables";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    toast.error("You must be logged in to access this page.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/crm"
          element={
            <ProtectedRoute>
              <CRMIntegration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/datainboard"
          element={
            <ProtectedRoute>
              <DataInBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newreport"
          element={
            <ProtectedRoute>
              <CreateReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report/:reportId/edit"
          element={
            <ProtectedRoute>
              <EditReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report/:reportId/view"
          element={
            <ProtectedRoute>
              <ViewReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploadimage"
          element={
            <ProtectedRoute>
              <ImageUploader setUploadedImage={setUploadedImage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/output"
          element={
            <ProtectedRoute>
              <ImageViewer uploadedImage={uploadedImage} />
            </ProtectedRoute>
          }
        />

        <Route path="/tables" element={<Tables />} />
      </Routes>
    </Router>
  );
}

export default App;
