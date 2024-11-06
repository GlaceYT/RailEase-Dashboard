import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Dashboard from "./components/complaintDashboard";
import Analytics from "./components/Analytics";
import Login from "./components/login"; // Import the Login component
import ComplaintDetails from "./components/ComplaintDetails";
import Home from "./components/home"; // Import the Home component

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <Routes>
          {/* Independent Login route */}
          <Route path="/login" element={<Login />} />

          {/* Routes with shared layout (Sidebar, Header, etc.) */}
          <Route
            path="/*"
            element={
              <div className="flex flex-grow">
                <Sidebar />
                <div className="flex-grow flex flex-col">
                  <Header />
                  <div className="flex-grow p-4 bg-gray-100">
                    <Routes>
                      <Route index element={<Home />} /> {/* Default route */}
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/complaint-details" element={<ComplaintDetails />} />
                    </Routes>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
