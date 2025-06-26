import { useState } from "react";
import styles from "./LocationSearchBox.module.css";
import { useLocationStore } from "../../../store/locationStore";

export default function LocationSearchBox() {
  const [searchValue, setSearchValue] = useState("");
  const { 
    searchQuery, 
    isLoading, 
    searchAndFilter, 
    setUserLocation,
    clearSearch 
  } = useLocationStore();

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    await searchAndFilter(searchValue, 15); // Default 15-mile radius
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        // Trigger filtering with current location
        // This will be handled by the store
      },
      () => alert("Unable to retrieve your location")
    );
  };

  const handleClearSearch = () => {
    setSearchValue("");
    clearSearch();
  };

  return (
    <div className={styles.container} aria-live="polite" data-open="true">
      <div className={styles.locationButtonWrapper}>
        <button
          className={styles.locationButton}
          name="location"
          aria-pressed="false"
          type="button"
          onClick={handleUseCurrentLocation}
        >
          {/* SVG icon here */}
          <span>Use my current location, or search an address below.</span>
        </button>
      </div>

      <div aria-hidden="false">
        <label htmlFor="searchInput" className="sr-only">
          Enter your location to find food near you:
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="search"
            className={styles.searchInput}
            id="searchInput"
            placeholder="Enter an address, city or zip code (e.g., 34947)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className={styles.searchButton}
            type="button"
            onClick={handleSearch}
            disabled={isLoading}
          >
            <span>
              <span className={styles.searchButtonLabel}>
                {isLoading ? "Searching..." : "Search"}
              </span>
            </span>
          </button>
          {searchQuery && (
            <button
              className={styles.clearButton}
              type="button"
              onClick={handleClearSearch}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        {searchQuery && (
          <div className={styles.searchInfo}>
            <small>
              Showing results within 15 miles of "{searchQuery}"
            </small>
          </div>
        )}
      </div>
    </div>
  );
}
