import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { useFilters } from "../../../../store/useFilters";

const options = [
  { label: "Food Pantry", value: "pantry" },
  { label: "Soup Kitchen", value: "soup-kitchen" },
  { label: "Baby Item Pantry", value: "baby-item-pantry" },
];

export default function FoodTypeDropdown() {
  const { foodTypes, setFoodTypes } = useFilters();

  const selectedLabels = options
    .filter((opt) => foodTypes.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div className="dropdown-wrapper">
      <label htmlFor="foodType" className="dropdown-label">
        Select by:
        <br/> 
        <br/>
        Food Type
      </label>

      <Menu
        menuButton={
          <MenuButton className="dropdown-button">
            {selectedLabels.length > 0
              ? selectedLabels.join(", ")
              : "All Options"}
          </MenuButton>
        }
        transition
      >
        {options.map((opt) => (
          <MenuItem
            key={opt.value}
            className="dropdown-item"
            onClick={() => setFoodTypes([opt.value])}
          >
            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                type="checkbox"
                checked={foodTypes.includes(opt.value)}
                onChange={() => setFoodTypes([opt.value])}
                onClick={(e) => e.stopPropagation()} // ✅ prevents dropdown from closing
              />
              {opt.label}
            </label>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
