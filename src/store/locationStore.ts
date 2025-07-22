import { create } from "zustand";
import { getDistanceInMiles } from "../utils/distance";
import agenciesFallback from "../data/agencies.json";

type Location = { lat: number; lng: number } | null;

type LocationStore = {
  // Location and search
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
  
  // Filters
  foodTypes: string[];
  nearbyDistance: string | null;
  daysOfWeek: string[];
  
  // Actions
  setUserLocation: (location: Location) => void;
  setSearchQuery: (query: string) => void;
  setDefaultRadius: (radius: number) => void;
  searchAndFilter: (query: string, radius?: number) => Promise<void>;
  filterAgencies: () => void;
  clearSearch: () => void;
  initializeFallback: () => void;
  expandSearchRadius: () => void;
  fetchAgencies: () => Promise<void>;
  
  // Filter actions
  toggleFoodType: (type: string) => void;
  setFoodTypes: (types: string[]) => void;
  setNearbyDistance: (distance: string | null) => void;
  toggleDayOfWeek: (day: string) => void;
  setDaysOfWeek: (days: string[]) => void;
  clearFilters: () => void;
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
  // Location and search state
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

  // Filter state
  foodTypes: [],
  nearbyDistance: null,
  daysOfWeek: [],

  // Basic setters
  setUserLocation: (location) => {
    set({ userLocation: location });
    get().filterAgencies(); // Refilter when location changes
  },

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

  // Filter actions
  toggleFoodType: (type) => {
    set((state) => ({
      foodTypes: state.foodTypes.includes(type)
        ? state.foodTypes.filter((t) => t !== type)
        : [...state.foodTypes, type],
    }));
    get().filterAgencies(); // Refilter after change
  },

  setFoodTypes: (types) => {
    set({ foodTypes: types });
    get().filterAgencies(); // Refilter after change
  },

  setNearbyDistance: (distance) => {
    set({ nearbyDistance: distance });
    get().filterAgencies(); // Refilter after change
  },

  toggleDayOfWeek: (day) => {
    set((state) => ({
      daysOfWeek: state.daysOfWeek.includes(day)
        ? state.daysOfWeek.filter((d) => d !== day)
        : [...state.daysOfWeek, day],
    }));
    get().filterAgencies(); // Refilter after change
  },

  setDaysOfWeek: (days) => {
    set({ daysOfWeek: days });
    get().filterAgencies(); // Refilter after change
  },

  clearFilters: () => {
    set({ 
      foodTypes: [], 
      nearbyDistance: null, 
      daysOfWeek: [] 
    });
    get().filterAgencies(); // Refilter after clearing
  },

  searchAndFilter: async (query, radius = 15) => {
    if (!query || query.trim() === "") {
      alert("Please enter a location to search.");
      return;
    }

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
        get().filterAgencies();
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

  filterAgencies: () => {
    const state = get();
    const { 
      userLocation, 
      allAgencies, 
      foodTypes, 
      nearbyDistance, 
      daysOfWeek,
      currentSearchRadius
    } = state;
    
    if (!userLocation) {
      // No location set - apply filters to all agencies
      let filtered = allAgencies.filter((agency: any) => {
        // Apply food type filter (multi-select)
        if (foodTypes.length > 0) {
          const hasMatchingProgram = foodTypes.some(type => {
            // Map filter values to agency program values
            const programMap: { [key: string]: string } = {
              'pantry': 'Pantry',
              'soup-kitchen': 'Soup Kitchen',
              'baby-item-pantry': 'Baby Item Pantry'
            };
            const programName = programMap[type] || type;
            return agency.programs?.includes(programName);
          });
          if (!hasMatchingProgram) return false;
        }

        // Apply days of week filter (multi-select)
        if (daysOfWeek.length > 0 && !agencyIsOpenOnDay(agency, daysOfWeek)) {
          return false;
        }

        return true;
      });

      // Add null distance for agencies without location
      const filteredWithDistance = filtered.map((agency: any) => ({
        ...agency,
        distance: null,
      }));
      
      set({ filteredAgencies: filteredWithDistance });
      return;
    }

    // Use nearbyDistance filter if set, otherwise use currentSearchRadius
    const effectiveRadius = nearbyDistance ? parseInt(nearbyDistance, 10) : currentSearchRadius;

    let filtered = allAgencies.filter((agency: any) => {
      if (!agency.coordinates) return false;

      const distance = getDistanceInMiles(
        userLocation.lat,
        userLocation.lng,
        agency.coordinates.lat,
        agency.coordinates.lng
      );

      // Apply distance filter
      if (distance > effectiveRadius) return false;

      // Apply food type filter (multi-select)
      if (foodTypes.length > 0) {
        const hasMatchingProgram = foodTypes.some(type => {
          // Map filter values to agency program values
          const programMap: { [key: string]: string } = {
            'pantry': 'Pantry',
            'soup-kitchen': 'Soup Kitchen',
            'baby-item-pantry': 'Baby Item Pantry'
          };
          const programName = programMap[type] || type;
          return agency.programs?.includes(programName);
        });
        if (!hasMatchingProgram) return false;
      }

      // Apply days of week filter (multi-select)
      if (daysOfWeek.length > 0 && !agencyIsOpenOnDay(agency, daysOfWeek)) {
        return false;
      }

      return true;
    });

    // Add distances and sort
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

    // Check if we need fallback search
    if (filtered.length === 0 && !state.isFallbackSearch && state.originalSearchQuery) {
      // No agencies found in initial radius, try expanding search
      const expandedRadius = Math.min(effectiveRadius * 2, 50); // Double radius, max 50 miles
      set({ 
        currentSearchRadius: expandedRadius,
        isFallbackSearch: true,
        isLoading: true
      });
      
      // Recursively call with expanded radius
      setTimeout(() => {
        get().filterAgencies();
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
      get().filterAgencies();
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
      isOutOfState: false,
      // Clear filters too
      foodTypes: [],
      nearbyDistance: null,
      daysOfWeek: []
    });
    // Initialize fallback agencies after clearing
    setTimeout(() => get().initializeFallback(), 100);
  },
}));
