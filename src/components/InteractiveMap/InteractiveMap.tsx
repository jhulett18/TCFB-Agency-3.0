import React, { useState, useEffect, useRef } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import agencies from "../../data/agencies.json";
import { useSelectedAgencyStore } from "../../store/useSelectedAgecy";
import "./InteractiveMap.css";

// Extend Window interface to include google
declare global {
  interface Window {
    google: typeof google;
  }
}

const center = { lat: 27.435, lng: -80.35 };
const zoom = 12;

interface Agency {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  hours?: string;
  directionsUrl: string;
  coordinates?: { lat: number; lng: number };
  programs?: string[];
}

function MapComponent() {
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  
  const selectedId = useSelectedAgencyStore((state) => state.selectedId);
  const { setSelectedId } = useSelectedAgencyStore();
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMarkerClick = (agency: Agency) => {
    setSelectedAgency(agency);
    setInfoWindowOpen(true);
    setSelectedId(agency.id);
    
    if (infoWindow && agency.coordinates) {
      infoWindow.setContent(`
        <div class="info-window">
          <h3>${agency.name}</h3>
          <p>${agency.address}, ${agency.city}</p>
          <p>📞 ${agency.phone || "No phone listed"}</p>
          <p>🕒 ${agency.hours || "Hours not listed"}</p>
          <a href="${agency.directionsUrl}" target="_blank" rel="noopener noreferrer" class="directions-link">
            ➤ Get Directions
          </a>
        </div>
      `);
      infoWindow.open(map, markers.find(m => m.title === agency.name));
    }
  };

  const handleInfoWindowClose = () => {
    setInfoWindowOpen(false);
    setSelectedAgency(null);
    setSelectedId(null);
    if (infoWindow) {
      infoWindow.close();
    }
  };

  // Helper function to get icon type based on agency programs
  const getIconType = (agency: Agency): string => {
    if (agency.programs && agency.programs.length > 0) {
      if (agency.programs.includes("soup-kitchen")) {
        return "soup-kitchen";
      } else if (agency.programs.includes("baby-item-pantry")) {
        return "baby-item-pantry";
      } else if (agency.programs.includes("pantry")) {
        return "pantry";
      }
    }
    return "pantry"; // Default to pantry icon
  };

  useEffect(() => {
    if (mapRef.current && !map && window.google) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapId: "YOUR_OPTIONAL_MAP_ID",
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });
      setMap(newMap);

      const newInfoWindow = new window.google.maps.InfoWindow();
      setInfoWindow(newInfoWindow);
    }
  }, [map]);

  useEffect(() => {
    if (map && window.google) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      const newMarkers: any[] = [];
      
      agencies.forEach((agency: Agency) => {
        if (!agency.coordinates) return;

        const iconType = getIconType(agency);
        const iconPath = `/icons/${iconType}.png`;
        const isSelected = selectedId === agency.id;
        
        // Create custom icon configuration with size based on selection
        const iconSize = isSelected ? 48 : 32; // 1.5x larger when selected
        const iconConfig = {
          url: iconPath,
          scaledSize: new window.google.maps.Size(iconSize, iconSize),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(iconSize / 2, iconSize / 2), // Center the anchor
        };

        const marker = new window.google.maps.Marker({
          position: agency.coordinates,
          title: agency.name,
          icon: iconConfig,
          map: map,
          opacity: isSelected ? 1 : 0.8,
          // Add a subtle animation effect
          animation: isSelected ? window.google.maps.Animation.BOUNCE : undefined,
        });

        marker.addListener('click', () => handleMarkerClick(agency));
        newMarkers.push(marker);
      });

      setMarkers(newMarkers);
    }
  }, [map, selectedId]);

  return <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
}

export default function InteractiveMap() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return (
      <div className="map-error">
        <h3>Google Maps API Key Missing</h3>
        <p>Please set up your Google Maps API key in the .env file:</p>
        <code>REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here</code>
        <p>Get your API key from: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></p>
      </div>
    );
  }

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <div className="map-loading">Loading map...</div>;
      case Status.FAILURE:
        return <div className="map-error">Map failed to load. Please check your API key.</div>;
      case Status.SUCCESS:
        return <MapComponent />;
    }
  };

  return (
    <div className="map-container">
      <Wrapper
        apiKey={apiKey}
        libraries={["places", "marker"]}
        render={render}
      />
    </div>
  );
}
