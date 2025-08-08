import React, { useEffect, useState } from "react";
import Header from "./components/header";

import game from "./games";
import SampleRenderer from "./components/sampleRenderer";
import { useWallpaper } from "./contexts/wallpaperContext";
import Page from "./components/page";
const App = () => {
  const [selectedPage, setSelectedPage] = useState("home");

  const [search, setSearch] = useState("");

  const { wallpaper } = useWallpaper();

  return (
    <div
      className="app"
      style={{ backgroundImage: `url(${String(wallpaper)})` }}
    >
      <Header
        isHome={selectedPage === "home"}
        goHome={() => setSelectedPage("home")}
        setSearch={setSearch}
        search={search}
      />

      {selectedPage === "home" ? (
        <div
          className="game-container"
          style={{
            padding: "1rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "start",
            flexDirection: "row",
            overflow: "scroll",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            height: "calc(100% - 60px)",
          }}
        >
          {game
            .filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <div onClick={() => setSelectedPage(item.name)} key={item.name}>
                <SampleRenderer item={item} />
              </div>
            ))}
        </div>
      ) : (
        <Page {...game.find((item) => item.name === selectedPage)!} />
      )}
    </div>
  );
};

export default App;
