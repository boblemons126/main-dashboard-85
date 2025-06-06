import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  const [customLocations, setCustomLocations] = useState<CustomLocation[]>(() => {
    try {
      const storedLocations = localStorage.getItem('customLocations');
      return storedLocations ? JSON.parse(storedLocations) : [];
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return [];
    }
  });

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(() => {
    try {
      const storedId = localStorage.getItem('selectedLocationId');
      return storedId ? JSON.parse(storedId) : null;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('customLocations', JSON.stringify(customLocations));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [customLocations]);

  useEffect(() => {
    try {
      localStorage.setItem('selectedLocationId', JSON.stringify(selectedLocationId));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [selectedLocationId]);

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
