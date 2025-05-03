import { createContext, useContext, useState, ReactNode } from "react";

interface ShowModalTrackContextType {
  showModalTrack: boolean;
  setShowModalTrack: (value: boolean) => void;
}

const ShowModalTrackContext = createContext<ShowModalTrackContextType | undefined>(undefined);

export const ShowModalTrackProvider = ({ children }: { children: ReactNode }) => {
  const [showModalTrack, setShowModalTrack] = useState(false);

  return (
    <ShowModalTrackContext.Provider value={{ showModalTrack, setShowModalTrack }}>
      {children}
    </ShowModalTrackContext.Provider>
  );
};

export const useShowModalTrack = () => {
  const context = useContext(ShowModalTrackContext);
  if (!context) throw new Error("useShowModalTrack must be used within ShowModalTrackProvider");
  return context;
};
