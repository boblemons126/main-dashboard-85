
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CustomLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  customLocations: CustomLocation[];
  addCustomLocation: (location: Omit<CustomLocation, 'id'>) => void;
  removeCustomLocation: (id: string) => void;
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customLocations, setCustomLocations] = useState<CustomLocation[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const addCustomLocation = (location: Omit<CustomLocation, 'id'>) => {
    const newLocation: CustomLocation = {
      ...location,
      id: Date.now().toString(),
    };
    setCustomLocations(prev => [...prev, newLocation]);
  };

  const removeCustomLocation = (id: string) => {
    setCustomLocations(prev => prev.filter(loc => loc.id !== id));
    if (selectedLocationId === id) {
      setSelectedLocationId(null);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        customLocations,
        addCustomLocation,
        removeCustomLocation,
        selectedLocationId,
        setSelectedLocationId,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
