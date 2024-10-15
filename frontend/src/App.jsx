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
import ImageViewer from "./components/OCR/pages/ImageViewer";
import Tables from "./components/OCR/pages/Tables";
import Insights from "./components/dashboard/Insights";
import RootDashboard from "./components/Root/RootDashboard";
import Settings from "./components/dashboard/settings/Settings";
import ViewBills from "./components/Root/ViewBills";
import EditBill from "./components/Root/EditBill";
import ManageFacilities from "./components/dashboard/settings/ManageFacilities";
import ManageUser from "./components/dashboard/settings/ManageUser";
import Services from "./components/landingPage/Pages/Services"
import RequestDemo from "./components/landingPage/Pages/RequestDemo";
import GHG from "./components/landingPage/Pages/Services/GHG";
import image from './components/landingPage/assets/image.png'
import AI from "./components/landingPage/Pages/Services/AI";
import BRSRReporting from "./components/landingPage/Pages/Services/BRSRReporting";
import AnomalyDetection from "./components/landingPage/Pages/Services/AnomalyDetection";
import CSRD from "./components/landingPage/Pages/Services/CSRD";
import Reporting from "./components/landingPage/Pages/Services/Reporting";
import SupplyChain from "./components/landingPage/Pages/Services/SuppyChain";
import ESRS from "./components/landingPage/Pages/Services/ESRS";
import GRIReporting from "./components/landingPage/Pages/Services/GRIReporting";
import BlogLP from "./components/BlogPage/frontend/BlogLP/BlogLP";
import AuthForm from "./components/BlogPage/frontend/Blogauth/Auth";



const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const location = useLocation();
  // console.log('App.jsx',user);

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
  if (requiredRole && user.role !== requiredRole) {
    toast.error("You do not have permission to access this page.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return <Navigate to="/" state={{ from: location }} replace />;
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
        <Route path="/services" element={<Services/>}/>
        <Route path="/request-demo" element={<RequestDemo/>}/>
        <Route path='/ghg' element={<GHG name='GHG Accounting' description='Something' image={image}/>}/>
        <Route path='/ai' element={<AI name='AI Assistant' description='Something' image={image}/>}/>
        <Route path='/brsr' element={<BRSRReporting name='BRSR Reporting' description='Something' image={image}/>}/>
        <Route path='/anomaly' element={<AnomalyDetection name='Anomaly Detection' description='Something' image={image}/>}/>
        <Route path='/csrd' element={<CSRD name='CSRD' description='Something' image={image}/>}/>
        <Route path='/reporting' element={<Reporting name='Reporting Analysis' description='Something' image={image}/>}/>
        <Route path='/supplychain' element={<SupplyChain name='Supply Chain' description='Something' image={image}/>}/>
        <Route path='/esrs' element={<ESRS name='ESRS' description='Something' image={image}/>}/>
        <Route path='/gri' element={<GRIReporting name='GRI Reporting' description='Something' image={image}/>}/>
        <Route path='/blog' element={<BlogLP/>}/>
        
        <Route path="/auth" element={<AuthForm/>}/>
        <Route
          path="/register"
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
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
          path="/insights"
          element={
            <ProtectedRoute>
              <Insights />
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
          path="/ocr/output"
          element={
            <ProtectedRoute>
              <ImageViewer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ocr/tables"
          element={
            <ProtectedRoute>
              <Tables setUploadedImage={setUploadedImage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rootDashboard"
          element={
            <ProtectedRoute requiredRole="SuperUser">
              <RootDashboard />
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
        <Route
          path="/viewbills"
          element={
            <ProtectedRoute requiredRole="SuperUser">
              <ViewBills />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewbills/:billId"
          element={
            <ProtectedRoute>
              <EditBill uploadedImage={uploadedImage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manageUsers"
          element={
            <ProtectedRoute>
              <ManageUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manageFacilities"
          element={
            <ProtectedRoute>
              <ManageFacilities />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
