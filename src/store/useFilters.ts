// src/store/useFilters.ts
import { create } from "zustand";

interface FiltersState {
  foodTypes: string[];
  distances: string[];
  daysOfWeek: string[];
  setFoodTypes: (types: string[]) => void;
  toggleFoodType: (type: string) => void;
  setDistances: (dists: string[]) => void;
  toggleDistance: (dist: string) => void;
  setDaysOfWeek: (days: string[]) => void;
  toggleDayOfWeek: (day: string) => void;
}

export const useFilters = create<FiltersState>((set) => ({
  foodTypes: [],
  distances: [],
  daysOfWeek: [],

  setFoodTypes: (types) => set({ foodTypes: types }),
  setDistances: (dists) => set({ distances: dists }),
  setDaysOfWeek: (days) => set({ daysOfWeek: days }),

  toggleFoodType: (type) =>
    set((state) => ({
      foodTypes: state.foodTypes.includes(type)
        ? state.foodTypes.filter((t) => t !== type)
        : [...state.foodTypes, type],
    })),
  // Toggle for Nearby Button
  toggleDistance: (dist) =>
    set((state) => ({
      distances: state.distances.includes(dist)
        ? state.distances.filter((d) => d !== dist)
        : [...state.distances, dist],
    })),
  toggleDayOfWeek: (day) =>
    set((state) => ({
      daysOfWeek: state.daysOfWeek.includes(day)
        ? state.daysOfWeek.filter((d) => d !== day)
        : [...state.daysOfWeek, day],
    })),
}));
