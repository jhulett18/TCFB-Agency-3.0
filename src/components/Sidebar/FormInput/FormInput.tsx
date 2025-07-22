import "./FormInput2.css";
import FoodTypeDropdown from "./filters/FoodTypeDropdown";
import NearbyDropdown from "./filters/NearbyDropdown";
import DayOfWeekDropdown from "./filters/DayOfWeekDropdown";

export default function FormInput() {

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
