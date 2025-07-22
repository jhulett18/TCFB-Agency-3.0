import React, { useState, useEffect, useMemo } from "react";
import MapComponent from "./components/InteractiveMap/InteractiveMap"; // adjust path if needed
import "./global.css";
import LeftSidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import "./AppResponsive.css"; // for responsive styles
import { useLocationStore } from "./store/locationStore";
import SplashPage from "./components/SplashPage/SplashPage";

export default function App() {
  // Mobile view toggle: false = list, true = map
  const [showMapMobile, setShowMapMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);
  const [splashComplete, setSplashComplete] = useState(false);
  const { filteredAgencies, fetchAgencies, allAgencies, agenciesLoaded, isLoading } = useLocationStore();

  // Removed filteredAgencies log

  // Fetch agencies on app load and poll every 30 minutes
  useEffect(() => {
    fetchAgencies();
    const intervalId = setInterval(() => {
      fetchAgencies();
    }, 1800000); // 30 minutes
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show splash for minimum 3 seconds after data loads
  useEffect(() => {
    if (agenciesLoaded && !isLoading) {
      const timer = setTimeout(() => {
        setSplashComplete(true);
      }, 3000); // 3 second delay
      return () => clearTimeout(timer);
    }
  }, [agenciesLoaded, isLoading]);

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

  // Memoize agencies to prevent unnecessary map reloads
  const agenciesToShow = useMemo(() => {
    return filteredAgencies.length > 0 ? filteredAgencies : allAgencies;
  }, [filteredAgencies, allAgencies]);

  // Show splash page while loading or for minimum 3 seconds
  if (!agenciesLoaded || isLoading || !splashComplete) {
    return <SplashPage />;
  }

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
          <MapComponent key="interactive-map" agencies={agenciesToShow} />
        </div>
      </div>
    </div>
  );
}
