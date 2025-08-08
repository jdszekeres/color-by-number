import { createContext, useContext } from "react";
import games from "../games";
export const possibleGames = games.map((game) => game.name);
type GameName = (typeof possibleGames)[number];
export interface ProgressContextType {
  progress: Record<GameName, boolean>;
  setProgress: (game: GameName, done: boolean) => void;
}

export const ProgressContext = createContext<ProgressContextType>({
  progress: possibleGames.reduce((acc, game) => {
    acc[game] = false;
    return acc;
  }, {} as Record<GameName, boolean>),
  setProgress: () => {},
});

export const ProgressProvider = ProgressContext.Provider;
export const ProgressConsumer = ProgressContext.Consumer;

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};
