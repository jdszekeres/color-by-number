import React from "react";
import { useWallpaper, wallpaperList } from "../contexts/wallpaperContext";
const WallpaperDropdown = ({
  visible = false,
  styles,
}: {
  visible: boolean;
  styles?: React.CSSProperties;
}) => {
  const { wallpaper, setWallpaper } = useWallpaper();

  if (!visible) return null;

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      ></div>
      <div
        style={{
          zIndex: 1000,
          position: "absolute",
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "8px",
          width: "100%",
          height: "100%",
          maxHeight: "300px",
          maxWidth: "400px",
          display: visible ? "flex" : "none",
          flexWrap: "wrap",
          flexDirection: "row",
          overflowY: "auto",

          ...styles,
        }}
      >
        {wallpaperList.map((wallpaper) => (
          <div
            key={wallpaper as string}
            onClick={() => setWallpaper(wallpaper)}
          >
            {(wallpaper as string) !== "null" ? (
              <img src={wallpaper as string} width="100" />
            ) : (
              <div
                style={{
                  width: "100px",
                  aspectRatio: "3/2",
                  backgroundColor: "#eee",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default WallpaperDropdown;
