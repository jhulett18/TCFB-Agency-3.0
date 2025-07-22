import React from "react";
import "./AgencyCard.css";
import Image from '../Image/Image';
import pantryIcon from '../../assets/icons/pantry.png';
import soupKitchenIcon from '../../assets/icons/soup-kitchen.png';
import babyItemPantryIcon from '../../assets/icons/baby-item-pantry.png';
import petsIcon from '../../assets/icons/pets.png';
// Add more imports as needed

const getIcon = (agency: any): string => {
  if (agency.programs && agency.programs.length > 0) {
    if (agency.programs.includes("soup-kitchen")) return soupKitchenIcon;
    if (agency.programs.includes("baby-item-pantry")) return babyItemPantryIcon;
    if (agency.programs.includes("pets")) return petsIcon;
    if (agency.programs.includes("pantry")) return pantryIcon;
    // Add more program types as needed
  }
  return pantryIcon; // Default to pantry icon
};

type Agency = {
  id: string;
  name: string;
  distance: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  directionsUrl: string;
  hours: string;
  programs: string[]; // e.g., ['pantry', 'baby-item-pantry']
};

type Props = {
  agency: Agency;
  onViewOnMap?: (agency: Agency) => void;
};

const AgencyCard: React.FC<Props> = ({ agency, onViewOnMap }) => {
  return (
    <li className="agency-card" data-id={agency.id}>
      <button
        type="button"
        className="agency-card__title-button"
        aria-label={`View ${agency.name} on map`}
        onClick={() => onViewOnMap?.(agency)}
      >
        <h4 className="agency-card__name">
          {agency.name}
          <span className="agency-card__distance">
            {" "}
            — {agency.distance} miles
          </span>
        </h4>
      </button>

      <div className="agency-card__content">
        <div className="agency-card__section agency-card__location">
          <h5 className="agency-card__label">Address:</h5>
          <p className="agency-card__text">
            {agency.address}
            <br />
            {agency.city}, {agency.state} {agency.zip}, {agency.country}
          </p>
        </div>

        <div className="agency-card__section agency-card__directions">
          <a
            href={agency.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="agency-card__directions-link"
          >
            Get Directions
          </a>
        </div>

        <div className="agency-card__section agency-card__phone">
          <h5 className="agency-card__label">Phone:</h5>
          <p className="agency-card__text">{agency.phone}</p>
        </div>

        <div className="agency-card__section agency-card__hours">
          <h5 className="agency-card__label">Hours:</h5>
          <p className="agency-card__text">{agency.hours}</p>
        </div>

        <div className="agency-card__section agency-card__programs">
          <h5 className="agency-card__label">Programs:</h5>
          <ul className="agency-card__program-list">
            <li className="agency-card__program-item">
              <Image
                src={getIcon(agency)}
                alt={agency.programs.join(", ")}
                width={24}
                height={24}
                className="agency-card__program-icon"
              />
              {agency.programs.map((program, index) => (
                <span key={index}>{program.replace(/-/g, " ")}{index < agency.programs.length - 1 ? ', ' : ''}</span>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
};

export default AgencyCard;
