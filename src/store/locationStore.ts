import { create } from "zustand";
import { getDistanceInMiles } from "../utils/distance";
import agenciesFallback from "../data/agencies.json";

type Location = { lat: number; lng: number } | null;

type LocationStore = {
  userLocation: Location;
  searchQuery: string;
  defaultRadius: number;
  filteredAgencies: any[];
  isLoading: boolean;
  currentSearchRadius: number;
  isFallbackSearch: boolean;
  originalSearchQuery: string;
  isOutOfState: boolean;
  allAgencies: any[];
  agenciesLoaded: boolean;
  setUserLocation: (location: Location) => void;
  setSearchQuery: (query: string) => void;
  setDefaultRadius: (radius: number) => void;
  searchAndFilter: (query: string, radius?: number) => Promise<void>;
  filterAgencies: (filters?: { radius?: number; foodTypes?: string[]; daysOfWeek?: string[] }) => void;
  clearSearch: () => void;
  initializeFallback: () => void;
  expandSearchRadius: () => void;
  fetchAgencies: () => Promise<void>;
};

// Helper to check if agency is open on any selected day
export function agencyIsOpenOnDay(agency: any, daysOfWeek: string[]): boolean {
  if (!daysOfWeek || daysOfWeek.length === 0) return true;
  if (!agency.hours) return false;
  const hoursLower = agency.hours.toLowerCase();
  return daysOfWeek.some(day => hoursLower.includes(day));
}

// Helper to check if location is in Florida
export function isInFlorida(lat: number, lng: number): boolean {
  // Florida boundaries (approximate)
  return lat >= 24.396308 && lat <= 31.000968 && 
         lng >= -87.634834 && lng <= -80.031362;
}

export const useLocationStore = create<LocationStore>((set, get) => ({
  userLocation: null,
  searchQuery: "",
  defaultRadius: 15,
  filteredAgencies: [],
  isLoading: false,
  currentSearchRadius: 15,
  isFallbackSearch: false,
  originalSearchQuery: "",
  isOutOfState: false,
  allAgencies: [],
  agenciesLoaded: false,

  setUserLocation: (location) => set({ userLocation: location }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setDefaultRadius: (radius) => set({ defaultRadius: radius }),

  fetchAgencies: async () => {
    if (get().agenciesLoaded) return;
    try {
      const res = await fetch("https://tcfb-lambda-git-main-wavvsofficial-4880s-projects.vercel.app/api/my-endpoint", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error("Failed to fetch agencies");
      const data = await res.json();
      let agenciesArray = null;
      if (Array.isArray(data)) {
        agenciesArray = data;
      } else if (Array.isArray(data.agencies)) {
        agenciesArray = data.agencies;
      }
      if (agenciesArray) {
        set({ allAgencies: agenciesArray, agenciesLoaded: true });
        get().filterAgencies(); // Update filteredAgencies after fetching new data
        console.log("[TCFB] Agencies loaded from endpoint.");
        console.log("First 3 agencies:", agenciesArray.slice(0, 3));
      } else {
        throw new Error("API did not return an array: " + JSON.stringify(data));
      }
    } catch (e) {
      set({ allAgencies: agenciesFallback, agenciesLoaded: true });
      get().filterAgencies(); // Update filteredAgencies after loading fallback data
      console.log("[TCFB] Agencies loaded from static fallback data.");
      console.log("First 3 agencies:", agenciesFallback.slice(0, 3));
      console.error("Error in fetchAgencies:", e);
    }
  },

  initializeFallback: () => {
    const fallbackAgencies = get().allAgencies.map((agency: any) => ({
      ...agency,
      distance: null,
    }));
    set({ filteredAgencies: fallbackAgencies });
  },

  searchAndFilter: async (query, radius = 15) => {
    set({ 
      isLoading: true, 
      searchQuery: query,
      currentSearchRadius: radius,
      isFallbackSearch: false,
      originalSearchQuery: query,
      isOutOfState: false
    });

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
        
        // Check if location is in Florida
        if (!isInFlorida(userLocation.lat, userLocation.lng)) {
          set({ 
            isLoading: false,
            isOutOfState: true,
            searchQuery: query,
            filteredAgencies: []
          });
          return;
        }
        
        set({ userLocation });
        get().filterAgencies({ radius });
      } else {
        set({ 
          isLoading: false,
          filteredAgencies: [],
          searchQuery: query
        });
        alert(`Unable to find location: ${query}. Please try a different address or zip code.`);
      }
    } catch (error) {
      console.error("Search failed:", error);
      set({ isLoading: false });
      alert(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  filterAgencies: (filters = {}) => {
    const { userLocation } = get();
    const { radius = 15, foodTypes = [], daysOfWeek = [] } = filters;
    const agencies = get().allAgencies;
    
    if (!userLocation) {
      // Fallback: Show all agencies when no location is set
      const fallbackAgencies = agencies.map((agency: any) => ({
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

      if (daysOfWeek.length > 0 && !agencyIsOpenOnDay(agency, daysOfWeek)) {
        return false;
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

    const state = get();
    
    // Check if we need fallback search
    if (filtered.length === 0 && !state.isFallbackSearch && state.originalSearchQuery) {
      // No agencies found in initial radius, try expanding search
      const expandedRadius = Math.min(radius * 2, 50); // Double radius, max 50 miles
      set({ 
        currentSearchRadius: expandedRadius,
        isFallbackSearch: true,
        isLoading: true
      });
      
      // Recursively call with expanded radius
      setTimeout(() => {
        get().filterAgencies({ 
          radius: expandedRadius, 
          foodTypes, 
          daysOfWeek 
        });
        set({ isLoading: false });
      }, 100);
    } else {
      set({ 
        filteredAgencies: filtered,
        isLoading: false
      });
    }
  },

  expandSearchRadius: () => {
    const state = get();
    if (!state.userLocation) return;
    
    const newRadius = Math.min(state.currentSearchRadius * 1.5, 100); // Increase by 50%, max 100 miles
    set({ 
      currentSearchRadius: newRadius,
      isLoading: true
    });
    
    setTimeout(() => {
      get().filterAgencies({ 
        radius: newRadius,
        foodTypes: [],
        daysOfWeek: []
      });
    }, 100);
  },

  clearSearch: () => {
    set({ 
      userLocation: null, 
      searchQuery: "", 
      filteredAgencies: [],
      isLoading: false,
      currentSearchRadius: 15,
      isFallbackSearch: false,
      originalSearchQuery: "",
      isOutOfState: false
    });
    // Initialize fallback agencies after clearing
    setTimeout(() => get().initializeFallback(), 100);
  },
}));
