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
import petsIcon from "../../assets/icons/pets.png";

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
  const { userLocation, currentSearchRadius, filteredAgencies } = useLocationStore();
  const { distances } = require("../../store/useFilters").useFilters();

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
    let effectiveRadius = currentSearchRadius;
    if (distances && distances.length > 0) {
      // Only one can be selected, so use the first
      const filterRadius = parseInt(distances[0], 10);
      effectiveRadius = Math.min(currentSearchRadius, filterRadius);
    }
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
  }, [userLocation, currentSearchRadius, distances]);

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
      // Create marker DOM
      const markerEl = document.createElement("div");
      markerEl.className = "custom-marker";
      markerEl.innerHTML = `
        <img 
          src="${iconPath}" 
          class="marker-icon" 
          alt="${agency.name}"
          style="width: 32px; height: 32px;"
        />
      `;
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: agency.coordinates,
        title: agency.name,
        content: markerEl,
      });
      markerRefs.current[agency.id] = marker;
      marker.addListener("click", () => {
        const html = `
          <div style="font-family: 'Segoe UI'; max-width: 260px; padding: 12px;">
            <h3 style="margin: 0; font-size: 1.1rem;">${agency.name}</h3>
            <p style="margin: 4px 0;">${agency.address}, ${agency.city}</p>
            <p style="margin: 4px 0;">📞 ${agency.phone || "No phone listed"}</p>
            <p style="margin: 4px 0;">🕒 ${agency.hours || "Hours not listed"}</p>
            <a href="${agency.directionsUrl}" target="_blank" style="color: #0066cc; text-decoration: underline;">➤ Get Directions</a>
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
      (marker.content as HTMLElement)?.classList.toggle("selected-marker", id === selectedId);
    });
  }, [selectedId]);

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
    if (agency.programs.includes("soup-kitchen")) {
      return soupKitchenIcon;
    } else if (agency.programs.includes("baby-item-pantry")) {
      return babyItemPantryIcon;
    } else if (agency.programs.includes("pantry")) {
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