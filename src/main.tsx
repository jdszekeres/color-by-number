import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { wallpaperList, WallpaperProvider } from "./contexts/wallpaperContext";
import { ProgressProvider } from "./contexts/progressContext";
import { ProgressWrapper } from "./contexts/progressWrapper";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    {(() => {
      return (
        <ProgressWrapper>
          <WallpaperProvider
            value={{
              wallpaper: wallpaperList[0],
              setWallpaper: (wallpaper) => {
                document.body.style.backgroundImage = `url(${String(
                  wallpaper
                )})`;
              },
            }}
          >
            <App />
          </WallpaperProvider>
        </ProgressWrapper>
      );
    })()}
  </React.StrictMode>
);
