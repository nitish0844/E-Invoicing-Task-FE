import { create } from "zustand";

// Store for Reconcillation screeen
export const useSelectDate = create((set) => ({
  selectedDates: new Date(),
  setSelectedDates: (date) => {
    console.log("state", date);
    set({ selectedDates: date });
  },
}));

export const useSelectAirport = create((set) => ({
  selectedAirport: [],
  setSelectedAirport: (airport) => set({ selectedAirport: airport }),
}));

export const useAeroplaneData = create((set) => ({
  selectedAeroplane: [],
  setSelectedAeroplane: (aeroplane) => set({ selectedAeroplane: aeroplane }),
}));

export const useFlightData = create((set) => ({
  selectedFlight: [],
  setSelectedFlight: (flight) => set({ selectedFlight: flight }),
}));

export const useCardData = create((set) => ({
  selectedCardData: [],
  setSelectedCardData: (data) => set({ selectedCardData: data }),
}));

// Store for FlightData screeen
export const useSelectDateFlightData = create((set) => ({
  selectedDates: new Date(),
  setSelectedDates: (date) => set({ selectedDates: date }),
}));

export const useSelectAirportFlightData = create((set) => ({
  selectedAirport: [],
  setSelectedAirport: (airport) => set({ selectedAirport: airport }),
}));

export const useAeroplaneDataFlightData = create((set) => ({
  selectedAeroplane: [],
  setSelectedAeroplane: (aeroplane) => set({ selectedAeroplane: aeroplane }),
}));

export const useFlightDataFlightData = create((set) => ({
  selectedFlight: [],
  setSelectedFlight: (flight) => set({ selectedFlight: flight }),
}));