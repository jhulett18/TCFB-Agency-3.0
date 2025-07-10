import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { useFilters } from "../../../../store/useFilters";

const distanceOptions = [
  { label: "Within 5 miles", value: "5" },
  { label: "Within 10 miles", value: "10" },
  { label: "Within 20 miles", value: "20" },
  { label: "Within 30 miles", value: "30" },
];

export default function NearbyDropdown() {
  const { distances, setDistances } = useFilters();

  const selectedLabels = distanceOptions
    .filter((opt) => distances.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div className="dropdown-wrapper">
      <label htmlFor="nearby" className="dropdown-label">
        Select by:
        <br/> 
        <br/>
        Nearest Agency
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
        {distanceOptions.map((opt) => (
          <MenuItem
            key={opt.value}
            className="dropdown-item"
            onClick={() => setDistances([opt.value])}
          >
            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                type="checkbox"
                checked={distances.includes(opt.value)}
                onChange={() => setDistances([opt.value])}
                onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
              />
              {opt.label}
            </label>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
