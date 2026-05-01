import { createContext, useContext, useState } from "react";

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisImage, setAnalysisImage] = useState(null);
  return (
    <AppCtx.Provider value={{ analysisResult, setAnalysisResult, analysisImage, setAnalysisImage }}>
      {children}
    </AppCtx.Provider>
  );
}

export const useApp = () => useContext(AppCtx);
