import React, { useEffect, useState } from "react";
import Header from "./components/header";
import {
  loadGamesWithProgress,
  loadGamesIncrementallyGenerator,
} from "./games";
import { Item } from "./types";
import SampleRenderer from "./components/sampleRenderer";
import { useWallpaper } from "./contexts/wallpaperContext";
import Page from "./components/page";
import { useProgress } from "./contexts/progressContext";

const App = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [search, setSearch] = useState("");
  const [games, setGames] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState({
    loaded: 0,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const { wallpaper } = useWallpaper();

  const { progress } = useProgress();

  // Load games with real-time progress when component mounts
  useEffect(() => {
    let cancelled = false;

    const fetchGamesWithGenerator = async () => {
      if (cancelled) return;

      setLoading(true);
      setError(null);

      let firstPageLoaded = false;

      try {
        // Alternative approach using async generator
        for await (const {
          games: newGames,
          pageNumber,
          totalPages,
        } of loadGamesIncrementallyGenerator()) {
          if (cancelled) return;

          console.log(
            `Loaded page ${pageNumber}/${totalPages} with ${newGames.length} games`
          );

          // Add new games as each page loads
          setGames((currentGames) =>
            [...currentGames, ...newGames].sort((a, b) =>
              a.name.localeCompare(b.name)
            )
          );
          setLoadingProgress({ loaded: pageNumber, total: totalPages });

          // Stop showing loading overlay after first page with actual games
          if (!firstPageLoaded && newGames.length > 0) {
            firstPageLoaded = true;
            setLoading(false);
            console.log("First page loaded, hiding loading overlay");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load games");
          console.error("Error loading games:", err);
          setLoading(false);
        }
      }
    };

    fetchGamesWithGenerator();

    // Cleanup function to prevent double loading
    return () => {
      cancelled = true;
    };
  }, []); // Empty dependency array - only run once

  if (loading && games.length === 0) {
    return (
      <div
        className="app"
        style={{ backgroundImage: `url(${String(wallpaper)})` }}
      >
        <Header
          isHome={true}
          goHome={() => {}}
          setSearch={setSearch}
          search={search}
        />
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Loading games...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="app"
        style={{ backgroundImage: `url(${String(wallpaper)})` }}
      >
        <Header
          isHome={true}
          goHome={() => {}}
          setSearch={setSearch}
          search={search}
        />
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

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
          {games
            .filter(
              (item) => item && item.name && typeof item.name === "string"
            ) // Safety check
            .filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <div onClick={() => setSelectedPage(item.name)} key={item.name}>
                <SampleRenderer item={item} completed={progress[item.name]} />
              </div>
            ))}
        </div>
      ) : (
        <Page {...games.find((item) => item.name === selectedPage)!} />
      )}
    </div>
  );
};

export default App;
