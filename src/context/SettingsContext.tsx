import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipleri tanımlayalım
export type MapType = "standard" | "satellite" | "hybrid";
export type UnitType = "km" | "mi";

interface SettingsContextType {
  mapType: MapType;
  setMapType: (type: MapType) => void;
  unit: UnitType;
  setUnit: (unit: UnitType) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // Varsayılan değerler
  const [mapType, setMapType] = useState<MapType>("standard");
  const [unit, setUnit] = useState<UnitType>("km");

  return (
    <SettingsContext.Provider value={{ mapType, setMapType, unit, setUnit }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
};