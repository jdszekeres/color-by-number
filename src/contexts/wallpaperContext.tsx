import { createContext, useContext } from "react";
import wallpapers from "../../wallpapers.json";

type Wallpaper = keyof typeof wallpapers;
export const wallpaperList: Wallpaper[] = wallpapers as Wallpaper[];

export interface WallpaperContextType {
  wallpaper: Wallpaper;
  setWallpaper: (wallpaper: Wallpaper) => void;
}

export const WallpaperContext = createContext<WallpaperContextType>({
  wallpaper: wallpaperList[0],
  setWallpaper: () => {},
});
export const WallpaperProvider = WallpaperContext.Provider;
export const WallpaperConsumer = WallpaperContext.Consumer;

export const useWallpaper = () => {
  const context = useContext(WallpaperContext);
  if (context === undefined) {
    throw new Error("useWallpaper must be used within a WallpaperProvider");
  }
  return context;
};
