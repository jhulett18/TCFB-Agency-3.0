import React, { useState, useRef, useEffect } from "react";
import AgencyCard from "./AgencyCard";
import agencyData from "../../data/agencies.json";
import { useSelectedAgencyStore } from "../../store/useSelectedAgecy";
import { useLocationStore } from "../../store/locationStore";
import "./AgencyList.css";

const BATCH_SIZE = 5;

export default function AgencyList() {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const selectedId = useSelectedAgencyStore((state) => state.selectedId);
  const setSelectedId = useSelectedAgencyStore((state) => state.setSelectedId);
  const { filteredAgencies, searchQuery, initializeFallback } = useLocationStore();
  const cardRefs = useRef<{ [id: string]: HTMLLIElement | null }>({});

  // Use filtered agencies if available, otherwise use fallback from agencyData
  const agenciesToShow = filteredAgencies.length > 0 ? filteredAgencies : agencyData.slice(0, 8);
  const visibleAgencies = agenciesToShow.slice(0, visibleCount);

  // Initialize fallback agencies on component mount
  useEffect(() => {
    if (filteredAgencies.length === 0) {
      initializeFallback();
    }
  }, [filteredAgencies.length, initializeFallback]);

  useEffect(() => {
    if (selectedId && cardRefs.current[selectedId]) {
      cardRefs.current[selectedId]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedId]);

  const loadMore = () => setVisibleCount((prev) => prev + BATCH_SIZE);

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [searchQuery]);

  return (
    <div>
      {!searchQuery && (
        <div className="welcome-section">
          <h3>Welcome to TCFB Agency Finder</h3>
          <p>Showing available food assistance agencies in the Treasure Coast area.</p>
          <div className="welcome-suggestions">
            <p><strong>To find agencies near you:</strong></p>
            <ul>
              <li>Enter your zip code or address in the search box above</li>
              <li>Filter by food type or distance once you've searched</li>
            </ul>
            <p><strong>Currently showing:</strong></p>
            <ul>
              <li>Available agencies in Fort Pierce, FL area</li>
              <li>Food pantries, soup kitchens, and baby item pantries</li>
            </ul>
          </div>
        </div>
      )}

      {searchQuery && (
        <div className="search-results-header">
          <h3>Found {agenciesToShow.length} agencies near you</h3>
          <p>Showing results within 15 miles of "{searchQuery}"</p>
        </div>
      )}

      <ul className="agency-list">
        {visibleAgencies.map((agency: any) => (
          <li
            key={agency.id}
            ref={(el) => (cardRefs.current[agency.id] = el)}
            className={`agency-card ${
              selectedId === agency.id ? "active" : ""
            }`}
            onClick={() => setSelectedId(agency.id)}
          >
            <AgencyCard agency={agency} />
          </li>
        ))}
      </ul>

      {visibleCount < agenciesToShow.length && (
        <div className="load-more-container">
          <button className="load-more-button" onClick={loadMore}>
            Load More ({agenciesToShow.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
