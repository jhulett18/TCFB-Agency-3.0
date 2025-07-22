import React, { useEffect, useRef } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import allAgencies from "../../data/agencies.json";
import { useSelectedAgencyStore } from "../../store/useSelectedAgecy";
import { useLocationStore } from "../../store/locationStore";
import "./InteractiveMap.css";

// Import icons directly
import pantryIcon from "../../assets/icons/pantry.png";
import soupKitchenIcon from "../../assets/icons/soup-kitchen.png";
import babyItemPantryIcon from "../../assets/icons/baby-item-pantry.png";

const center = { lat: 27.435, lng: -80.35 };
const zoom = 12;

function MapComponent({ agencies }: { agencies: any[] }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const radiusCircleRef = useRef<google.maps.Circle | null>(null);
  const markerRefs = useRef<{
    [id: string]: google.maps.marker.AdvancedMarkerElement;
  }>({});
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const selectedId = useSelectedAgencyStore((state) => state.selectedId);
  const { setSelectedId } = useSelectedAgencyStore();
  const { userLocation, currentSearchRadius, filteredAgencies, nearbyDistance } = useLocationStore();

  // Add global print function for map info windows
  React.useEffect(() => {
    (window as any).printAgencyInfo = (id: string, name: string, address: string, phone: string, hours: string, directionsUrl: string) => {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const printContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Agency Information - ${name}</title>
              <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; }
                h1 { color: #333; border-bottom: 2px solid #333; }
                .section { margin: 15px 0; }
                .label { font-weight: bold; color: #666; }
              </style>
            </head>
            <body>
              <h1>${name}</h1>
              <div class="section">
                <span class="label">Address:</span><br>
                ${address}
              </div>
              <div class="section">
                <span class="label">Phone:</span> ${phone}
              </div>
              <div class="section">
                <span class="label">Hours:</span><br>
                ${hours}
              </div>
              <div class="section">
                <span class="label">Directions:</span><br>
                <a href="${directionsUrl}" target="_blank">Get Directions</a>
              </div>
            </body>
          </html>
        `;
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    };

    // Cleanup function to remove global function
    return () => {
      delete (window as any).printAgencyInfo;
    };
  }, []);

  // Initialize map only once
  useEffect(() => {
    if (!window.google?.maps?.marker?.AdvancedMarkerElement) return;
    if (mapRef.current) return; // Already initialized

    const map = new google.maps.Map(
      mapContainerRef.current as HTMLElement,
      {
        center,
        zoom,
        mapId: "YOUR_OPTIONAL_MAP_ID",
      }
    );
    mapRef.current = map;
    infoWindowRef.current = new google.maps.InfoWindow();
  }, []);

  // Handle user location changes - zoom to location
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    const map = mapRef.current;
    map.panTo(userLocation);
    map.setZoom(10); // Adjust zoom level as needed
  }, [userLocation]);

  // Handle radius circle updates
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    const map = mapRef.current;
    // Remove existing radius circle
    if (radiusCircleRef.current) {
      radiusCircleRef.current.setMap(null);
    }
    // Calculate effective radius based on filter
    let effectiveRadius = nearbyDistance ? parseInt(nearbyDistance, 10) : currentSearchRadius;
    // Create new radius circle
    const circle = new google.maps.Circle({
      strokeColor: "#4285F4", // Light blue
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#4285F4",
      fillOpacity: 0.1,
      map,
      center: userLocation,
      radius: effectiveRadius * 1609.34, // Convert miles to meters
    });
    radiusCircleRef.current = circle;
  }, [userLocation, currentSearchRadius, nearbyDistance]);

  // Update markers when agencies change
  useEffect(() => {
    if (!window.google?.maps?.marker?.AdvancedMarkerElement) return;
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    Object.values(markerRefs.current).forEach((marker) => {
      marker.map = null;
    });
    markerRefs.current = {};

    agencies.forEach((agency) => {
      if (!agency.coordinates) return;
      const iconPath = getIcon(agency);
      // Create marker DOM using an <img> element as per Google Maps reference
      const markerImg = document.createElement('img');
      markerImg.src = iconPath;
      markerImg.className = 'marker-icon';
      markerImg.alt = agency.name;
      markerImg.style.width = '32px';
      markerImg.style.height = '32px';
      // Remove other inline styles to allow CSS animation

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: agency.coordinates,
        title: agency.name,
        content: markerImg,
      });
      markerRefs.current[agency.id] = marker;
      marker.addListener("click", () => {
        const html = `
          <div class="info-window">
            <h3>${agency.name}</h3>
            <p class="address">${agency.address}, ${agency.city}</p>
            <p class="contact-info">📞 ${agency.phone || "No phone listed"}</p>
            <p class="hours">🕒 ${agency.hours || "Hours not listed"}</p>
            <a href="${agency.directionsUrl}" target="_blank" class="directions-link">➤ Get Directions</a>
            <button 
              onclick="printAgencyInfo('${agency.id}', '${agency.name.replace(/'/g, "\\'")}', '${agency.address}, ${agency.city}', '${agency.phone || "No phone listed"}', '${agency.hours || "Hours not listed"}', '${agency.directionsUrl}')" 
              class="print-btn"
            >
              Print
            </button>
          </div>
        `;
        infoWindowRef.current?.setContent(html);
        infoWindowRef.current?.open(map, marker);
        setSelectedId(agency.id);
      });
    });
  }, [agencies, setSelectedId]);

  // Update marker appearance on selection
  useEffect(() => {
    Object.entries(markerRefs.current).forEach(([id, marker]) => {
      const img = marker.content as HTMLImageElement;
      if (img) {
        if (String(id) === String(selectedId)) {
          img.classList.add("selected");
        } else {
          img.classList.remove("selected");
        }
      }
    });
  }, [selectedId, agencies]);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      style={{
        height: "100vh",
        width: "100%",
        position: "relative",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    />
  );
}

// Helper function to get icon based on agency programs
const getIcon = (agency: any): string => {
  if (agency.programs && agency.programs.length > 0) {
    if (agency.programs.includes("Soup Kitchen")) {
      return soupKitchenIcon;
    } else if (agency.programs.includes("Baby Item Pantry")) {
      return babyItemPantryIcon;
    } else if (agency.programs.includes("Pantry")) {
      return pantryIcon;
    }
  }
  return pantryIcon; // Default to pantry icon
};

export default function InteractiveMap({ agencies }: { agencies?: any[] } = {}) {
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
        return <MapComponent agencies={agencies || allAgencies} />;
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