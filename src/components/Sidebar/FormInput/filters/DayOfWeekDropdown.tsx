import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { useFilters } from "../../../../store/useFilters";

const days = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
];

export default function DayOfWeekDropdown() {
  const { daysOfWeek, toggleDayOfWeek } = useFilters();

  const selectedLabels = days
    .filter((opt) => daysOfWeek.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div className="dropdown-wrapper">
      <label htmlFor="dayOfWeek" className="dropdown-label">
        Select by:
        <br/> 
        <br/>
        Days Open
      </label>

      <Menu
        menuButton={
          <MenuButton className="dropdown-button">
            {selectedLabels.length > 0
              ? selectedLabels.join(", ")
              : "All Days"}
          </MenuButton>
        }
        transition
      >
        {days.map((opt) => (
          <MenuItem
            key={opt.value}
            className="dropdown-item"
            onClick={() => null}
          >
            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                type="checkbox"
                checked={daysOfWeek.includes(opt.value)}
                onChange={() => toggleDayOfWeek(opt.value)}
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