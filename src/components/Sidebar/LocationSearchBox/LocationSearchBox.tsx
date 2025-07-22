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
    clearSearch,
    currentSearchRadius,
    isFallbackSearch,
    originalSearchQuery,
    expandSearchRadius,
    isOutOfState,
    nearbyDistance
  } = useLocationStore();

  // Calculate effective radius based on filters
  const getEffectiveRadius = () => {
    return nearbyDistance ? parseInt(nearbyDistance, 10) : currentSearchRadius;
  };

  const handleSearch = async () => {
    const trimmed = searchValue.trim();
    if (!trimmed) return;
    await searchAndFilter(trimmed, 15); // Start with 15-mile radius
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

  const handleExpandSearch = () => {
    expandSearchRadius();
  };

  // Show out-of-state message
  if (isOutOfState) {
    return (
      <div className={styles.container} aria-live="polite" data-open="true">
        <div className={styles.outOfStateMessage}>
          <h3>Outside Our Service Area</h3>
          <p>We're sorry, but your location is outside of our service area in the Treasure Coast region of Florida.</p>
          <p><strong>We serve:</strong></p>
          <ul>
            <li>Indian River County</li>
            <li>St. Lucie County</li>
            <li>Martin County</li>
            <li>Okeechobee County</li>
          </ul>
          <p>If you're looking for food assistance in your area, please:</p>
          <ul>
            <li>Contact your local food bank</li>
            <li>Visit <a href="https://www.feedingamerica.org/find-your-local-foodbank" target="_blank" rel="noopener noreferrer">Feeding America</a> to find resources near you</li>
            <li>Call 211 for local assistance</li>
          </ul>
          <p>If you'd like to learn more about our services or have questions, please contact us at <a href="mailto:info@stophunger.org">info@stophunger.org</a> or call <a href="tel:772-489-3034">772-489-3034</a>.</p>
          <button onClick={handleClearSearch} className={styles.retryButton}>
            Try a different location
          </button>
        </div>
      </div>
    );
  }

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
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className={styles.searchButton}
            type="button"
            onClick={handleSearch}
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
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
              {isFallbackSearch ? (
                <>
                  No agencies found in {originalSearchQuery}, showing closest options within {getEffectiveRadius()} miles.
                  <button 
                    onClick={handleExpandSearch}
                    style={{ 
                      marginLeft: 8, 
                      background: 'none', 
                      border: 'none', 
                      color: '#0066cc', 
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: 'inherit'
                    }}
                  >
                    Expand search
                  </button>
                </>
              ) : (
                `Showing results within ${getEffectiveRadius()} miles of "${searchQuery}"`
              )}
            </small>
          </div>
        )}
      </div>
    </div>
  );
}
