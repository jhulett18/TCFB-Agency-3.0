import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { useLocationStore } from "../../../../store/locationStore";

const distanceOptions = [
  { label: "Within 5 miles", value: "5" },
  { label: "Within 10 miles", value: "10" },
  { label: "Within 20 miles", value: "20" },
  { label: "Within 30 miles", value: "30" },
];

export default function NearbyDropdown() {
  const { nearbyDistance, setNearbyDistance, userLocation } = useLocationStore();

  const selectedLabel = distanceOptions.find(opt => opt.value === nearbyDistance)?.label;
  const isDisabled = !userLocation;

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
          <MenuButton 
            className="dropdown-button" 
            disabled={isDisabled}
            style={{
              opacity: isDisabled ? 0.5 : 1,
              cursor: isDisabled ? 'not-allowed' : 'pointer'
            }}
          >
            {isDisabled ? "Search for location first" : (selectedLabel || "All Options")}
          </MenuButton>
        }
        transition
      >
        <MenuItem
          key="clear"
          className="dropdown-item"
          onClick={() => setNearbyDistance(null)}
        >
          <label
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <input
              type="radio"
              checked={nearbyDistance === null}
              onChange={() => setNearbyDistance(null)}
              onClick={(e) => e.stopPropagation()}
            />
            All Options
          </label>
        </MenuItem>
        {distanceOptions.map((opt) => (
          <MenuItem
            key={opt.value}
            className="dropdown-item"
            onClick={() => setNearbyDistance(opt.value)}
          >
            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                type="radio"
                checked={nearbyDistance === opt.value}
                onChange={() => setNearbyDistance(opt.value)}
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
