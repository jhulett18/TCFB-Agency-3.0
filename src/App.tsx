import React, { useState, useEffect } from "react";
import MapComponent from "./components/InteractiveMap/InteractiveMap"; // adjust path if needed
import "./global.css";
import LeftSidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import "./AppResponsive.css"; // for responsive styles
import { useLocationStore } from "./store/locationStore";

export default function App() {
  // Mobile view toggle: false = list, true = map
  const [showMapMobile, setShowMapMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);
  const { filteredAgencies } = useLocationStore();

  // Update isMobile on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 750;
      setIsMobile(mobile);
      if (!mobile) {
        setShowMapMobile(false); // Always show both on desktop
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handler for toggle button
  const handleToggle = () => setShowMapMobile((prev) => !prev);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <Navbar />

      {/* Toggle Button (mobile only) */}
      {isMobile && (
        <div className="toggle-btn-group">
          <button
            className="toggle-view-btn"
            aria-label={showMapMobile ? "Show List View" : "Show Map View"}
            onClick={handleToggle}
          >
            {showMapMobile ? "Agencies" : "Maps"}
          </button>
          <a
            href="https://stophunger.org"
            className="toggle-view-btn"
            aria-label="Return to Main Site"
            style={{ textDecoration: "none" }}
          >
            Main Site
          </a>
        </div>
      )}

      {/* Sidebar and Map Container */}
      <div className="main-content-responsive">
        {/* SIDEBAR */}
        <div
          className={`sidebar-responsive ${isMobile && showMapMobile ? "hidden-mobile" : ""}`}
        >
          <LeftSidebar />
        </div>

        {/* MAP COMPONENT */}
        <div
          className={`map-responsive ${isMobile && !showMapMobile ? "hidden-mobile" : ""}`}
        >
          <MapComponent agencies={filteredAgencies} />
        </div>
      </div>
    </div>
  );
}
