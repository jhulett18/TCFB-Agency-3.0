import { create } from "zustand";
import { getDistanceInMiles } from "../utils/distance";
import agencies from "../data/agencies.json";

type Location = { lat: number; lng: number } | null;

type LocationStore = {
  userLocation: Location;
  searchQuery: string;
  defaultRadius: number;
  filteredAgencies: any[];
  isLoading: boolean;
  setUserLocation: (location: Location) => void;
  setSearchQuery: (query: string) => void;
  setDefaultRadius: (radius: number) => void;
  searchAndFilter: (query: string, radius?: number) => Promise<void>;
  filterAgencies: (radius?: number, foodTypes?: string[]) => void;
  clearSearch: () => void;
  initializeFallback: () => void;
};

export const useLocationStore = create<LocationStore>((set, get) => ({
  userLocation: null,
  searchQuery: "",
  defaultRadius: 15,
  filteredAgencies: [],
  isLoading: false,

  setUserLocation: (location) => set({ userLocation: location }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setDefaultRadius: (radius) => set({ defaultRadius: radius }),

  initializeFallback: () => {
    const fallbackAgencies = agencies.slice(0, 8).map((agency: any) => ({
      ...agency,
      distance: null,
    }));
    set({ filteredAgencies: fallbackAgencies });
  },

  searchAndFilter: async (query, radius = 15) => {
    set({ isLoading: true, searchQuery: query });

    try {
      const geocoder = new window.google.maps.Geocoder();
      const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address: query }, (results, status) => {
          if (status === "OK" && results) {
            resolve(results);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      if (results.length > 0) {
        const location = results[0].geometry.location;
        const userLocation = { lat: location.lat(), lng: location.lng() };
        
        set({ userLocation });
        get().filterAgencies(radius);
      } else {
        alert(`Unable to find location: ${query}. Please try a different address or zip code.`);
      }
    } catch (error) {
      console.error("Search failed:", error);
      alert(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      set({ isLoading: false });
    }
  },

  filterAgencies: (radius = 15, foodTypes = []) => {
    const { userLocation } = get();
    
    if (!userLocation) {
      // Fallback: Show first 8 agencies when no location is set
      const fallbackAgencies = agencies.slice(0, 8).map((agency: any) => ({
        ...agency,
        distance: null,
      }));
      set({ filteredAgencies: fallbackAgencies });
      return;
    }

    let filtered = agencies.filter((agency: any) => {
      if (!agency.coordinates) return false;

      const distance = getDistanceInMiles(
        userLocation.lat,
        userLocation.lng,
        agency.coordinates.lat,
        agency.coordinates.lng
      );

      if (distance > radius) return false;

      if (foodTypes.length > 0) {
        const hasMatchingProgram = foodTypes.some(type => 
          agency.programs?.includes(type)
        );
        if (!hasMatchingProgram) return false;
      }

      return true;
    });

    filtered = filtered.map((agency: any) => ({
      ...agency,
      distance: parseFloat(getDistanceInMiles(
        userLocation.lat,
        userLocation.lng,
        agency.coordinates!.lat,
        agency.coordinates!.lng
      ).toFixed(2)),
    }));

    filtered.sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));

    set({ filteredAgencies: filtered });
  },

  clearSearch: () => {
    set({ 
      userLocation: null, 
      searchQuery: "", 
      filteredAgencies: [],
      isLoading: false 
    });
    // Trigger fallback display after clearing
    setTimeout(() => get().filterAgencies(), 100);
  },
}));
