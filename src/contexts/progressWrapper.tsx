import React from "react";
import { ProgressProvider } from "./progressContext";

export const ProgressWrapper = ({ children }) => {
  const [progress, setProgressState] = React.useState(
    Object.fromEntries(
      Object.keys(localStorage)
        .filter((key) => key.startsWith("progress_"))
        .map((key) => [
          key.substring("progress_".length),
          JSON.parse(localStorage.getItem(key) || "false"),
        ])
    )
  );
  const setProgress = (game, done) => {
    localStorage.setItem(`progress_${game}`, JSON.stringify(done));
    setProgressState((prev) => ({ ...prev, [game]: done }));
  };
  return (
    <ProgressProvider value={{ progress, setProgress }}>
      {children}
    </ProgressProvider>
  );
};
