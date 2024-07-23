import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import LandingPage from "./components/landingPage/LandingPage";
import CRMIntegration from "./components/dashboard/CRM";
import DataBoard from "./components/dashboard/DataBoard";
import Report from "./components/dashboard/Report";
import CreateReport from "./components/dashboard/CreateReport";
import Login from "./auth/Login";
import Register from "./auth/Register";


function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/login' element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/crm" element={<CRMIntegration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/databoard" element={<DataBoard />} />
        <Route path="/report" element={<Report />} />
        <Route path="/newreport" element={<CreateReport/>}/>
      </Routes>
    </Router>
  );
}

export default App;
