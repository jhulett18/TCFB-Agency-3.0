import React, { useState, useRef, useEffect } from "react";
import AgencyCard from "./AgencyCard";
import agencyData from "../../data/agencies.json";
import { useSelectedAgencyStore } from "../../store/useSelectedAgecy";
import { useLocationStore } from "../../store/locationStore";
import "./AgencyList.css";

const BATCH_SIZE = 10;

export default function AgencyList() {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const selectedId = useSelectedAgencyStore((state) => state.selectedId);
  const setSelectedId = useSelectedAgencyStore((state) => state.setSelectedId);
  const { filteredAgencies, searchQuery, initializeFallback, nearbyDistance, daysOfWeek, foodTypes } = useLocationStore();
  const cardRefs = useRef<{ [id: string]: HTMLLIElement | null }>({});

  // Show results header if any filter is active or searchQuery is set
  const filtersActive = searchQuery || nearbyDistance || daysOfWeek.length > 0 || foodTypes.length > 0;
  
  // Use filtered agencies if available, otherwise use fallback from agencyData only when no filters are active
  const agenciesToShow = filtersActive ? filteredAgencies : (filteredAgencies.length > 0 ? filteredAgencies : agencyData.slice(0, 8));
  const visibleAgencies = agenciesToShow.slice(0, visibleCount);

  // Initialize fallback agencies on component mount only when no filters are active
  useEffect(() => {
    if (filteredAgencies.length === 0 && !filtersActive) {
      initializeFallback();
    }
  }, [filteredAgencies.length, initializeFallback, filtersActive]);

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
  const showNoResults = filtersActive && filteredAgencies.length === 0;
  let noResultsMsg = "No agencies found for your search.";
  if (showNoResults) {
    if (foodTypes.length > 0 && daysOfWeek.length > 0) {
      noResultsMsg =
        "No agencies found for the selected food types and days. Try selecting different food types or more days.";
    } else if (foodTypes.length > 0) {
      noResultsMsg =
        "No agencies found for the selected food types. Try selecting different food types.";
    } else if (nearbyDistance && daysOfWeek.length > 0) {
      noResultsMsg =
        "No agencies found for the selected distance and days. Try broadening your distance or selecting more days.";
    } else if (nearbyDistance) {
      noResultsMsg =
        "No agencies found for the selected distance. Try increasing your distance filter for more results.";
    } else if (daysOfWeek.length > 0) {
      noResultsMsg =
        "No agencies open on the selected days. Try selecting more days or clearing the day filter.";
    } else {
      noResultsMsg =
        "No agencies found for your search. Try adjusting your filters for more results.";
    }
  }

  return (
    <div>
      {!filtersActive && (
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

      {filtersActive && !showNoResults && (
        <div className="search-results-header">
          <h3>Found {agenciesToShow.length} agencies near you</h3>
        </div>
      )}

      {showNoResults && (
        <div className="no-results-message" style={{ color: "#b00020", margin: "1.5em 0", fontWeight: 500 }}>
          {noResultsMsg}
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
            onClick={() => {
              console.log("Agency card clicked, setting selectedId to:", agency.id);
              setSelectedId(agency.id);
            }}
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
