import React from 'react';
import Image from './Image';
import logo from '../../assets/tcfb_logo.png';
import pantryIcon from '../../assets/icons/pantry.png';
import soupKitchenIcon from '../../assets/icons/soup-kitchen.png';
import babyItemPantryIcon from '../../assets/icons/baby-item-pantry.png';
import petsIcon from '../../assets/icons/pets.png';

export default function ImageTest() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Image Component Test</h2>
      
      <h3>Logo Test:</h3>
      <Image 
        src={logo} 
        alt="TCFB Logo" 
        width={100} 
        height={50}
      />
      
      <h3>Icon Tests:</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Image 
          src={pantryIcon} 
          alt="Pantry Icon" 
          width={32} 
          height={32}
        />
        <Image 
          src={soupKitchenIcon} 
          alt="Soup Kitchen Icon" 
          width={32} 
          height={32}
        />
        <Image 
          src={babyItemPantryIcon} 
          alt="Baby Item Pantry Icon" 
          width={32} 
          height={32}
        />
        <Image 
          src={petsIcon} 
          alt="Pets Icon" 
          width={32} 
          height={32}
        />
      </div>
      
      <h3>Error Test (should show error state):</h3>
      <Image 
        src="nonexistent-image.png" 
        alt="Non-existent Image" 
        width={100} 
        height={50}
      />
    </div>
  );
} 