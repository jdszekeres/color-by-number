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
    <ProgressProvider value={{ progress: {}, setProgress: () => {} }}>
      <WallpaperProvider
        value={{ wallpaper: wallpaperList[0], setWallpaper: () => {} }}
      >
        <App />
      </WallpaperProvider>
    </ProgressProvider>
  </React.StrictMode>
);

