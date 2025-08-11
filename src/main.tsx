import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { wallpaperList, WallpaperProvider } from "./contexts/wallpaperContext";
import { ProgressProvider } from "./contexts/progressContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ProgressProvider
      value={{
        progress: {
          ...Object.fromEntries(
            Object.keys(localStorage)
              .filter((key) => key.startsWith("progress_"))
              .map((key) => [
                key.substring("progress_".length),
                JSON.parse(localStorage.getItem(key) || "false"), // Handles keys with spaces
              ])
          ),
        },
        setProgress: (game, done) => {
          localStorage.setItem(`progress_${game}`, JSON.stringify(done));
        },
      }}
    >
      <WallpaperProvider
        value={{
          wallpaper: wallpaperList[0],
          setWallpaper: (wallpaper) => {
            document.body.style.backgroundImage = `url(${String(wallpaper)})`;
          },
        }}
      >
        <App />
      </WallpaperProvider>
    </ProgressProvider>
  </React.StrictMode>
);
