import { useState, useEffect } from "react";
import "./FormInput2.css";

import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { Button } from "../../Button/Button"; // use relative if no alias
import FoodTypeDropdown from "./filters/FoodTypeDropdown";
import NearbyDropdown from "./filters/NearbyDropdown";
import DayOfWeekDropdown from "./filters/DayOfWeekDropdown";
import { useFilters } from "../../../store/useFilters";
import { useLocationStore } from "../../../store/locationStore";

export default function FormInput() {
  const [searchValue, setSearchValue] = useState("");
  const { distances, foodTypes, daysOfWeek } = useFilters();
  const { filterAgencies, currentSearchRadius } = useLocationStore();

  useEffect(() => {
    // Convert distances to number, pick the largest selected, or use search radius
    let filterRadius = currentSearchRadius;
    if (distances.length > 0) {
      filterRadius = Math.max(...distances.map((d) => parseInt(d, 10)));
    }
    // Use the filter radius (filters can expand the search area)
    const effectiveRadius = filterRadius;
    filterAgencies({ radius: effectiveRadius, foodTypes, daysOfWeek });
  }, [distances, foodTypes, daysOfWeek, filterAgencies, currentSearchRadius]);

  return (
    <div className="container" aria-live="polite" data-open="true">
      <div className="formIntro">
        <h3 className="formIntroHeading">
          Share more details to narrow your search results.
        </h3>
      </div>

      {/* FOOD TYPE AND NEARBY FILTERING */}
      <div className="dropdown-group">
        {/* FILTER TYPE */}
        <FoodTypeDropdown />

        {/* Nearby Filter */}
        <NearbyDropdown />

        {/* Day of Week Filter */}
        <DayOfWeekDropdown />
      </div>
    </div>
  );
}
