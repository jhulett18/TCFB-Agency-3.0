/**
 * Get the correct path for images in the public folder
 * Works in both development and production
 */
export const getImagePath = (path: string): string => {
  // In development, PUBLIC_URL is "/"
  // In production, PUBLIC_URL is "/agency"
  const basePath = process.env.PUBLIC_URL || '';
  return `${basePath}/${path}`;
};

/**
 * Get icon path for map markers
 */
export const getIconPath = (iconName: string): string => {
  return getImagePath(`/${iconName}.png`);
};

/**
 * Get asset path for logos and other assets
 */
export const getAssetPath = (assetName: string): string => {
  return getImagePath(`/assets/${assetName}`);
};

// Import all assets and icons
import tcfbLogo from '../assets/tcfb_logo.png';
import pantryIcon from '../assets/icons/pantry.png';
import soupKitchenIcon from '../assets/icons/soup-kitchen.png';
import babyItemPantryIcon from '../assets/icons/baby-item-pantry.png';
import petsIcon from '../assets/icons/pets.png';

// Export a mapping for icons
export const icons = {
  pantry: pantryIcon,
  'soup-kitchen': soupKitchenIcon,
  'baby-item-pantry': babyItemPantryIcon,
  pets: petsIcon,
};

// Export logo and other assets
export const assets = {
  tcfbLogo,
}; 