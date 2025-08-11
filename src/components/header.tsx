import React, { useEffect } from "react";
import WallpaperDropdown from "./wallpaperDropdown";
import { MountainSnowIcon } from "lucide-react";
interface HeaderProps {
  isHome: boolean;
  goHome: () => void;
  setSearch: (search: string) => void;
  search: string;
}
const Header = ({ isHome, goHome, setSearch, search }: HeaderProps) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const [showDropdown, setShowDropdown] = React.useState(false);

  useEffect(() => {
    const p = (e: Event) => e.preventDefault();
    if (showDropdown) {
      document.body.style.overflowX = "hidden";
      document.documentElement.style.scrollbarWidth = "none";
      window.addEventListener("scroll", p, { passive: false });
      window.addEventListener("wheel", p, { passive: false });
      window.addEventListener("touchmove", p, { passive: false });
      window.addEventListener("mousewheel", p, { passive: false });
      const handleClickOutside = (event: MouseEvent) => {
        if (
          event.target instanceof HTMLElement &&
          !event.target.closest(".wallpaper-dropdown")
        ) {
          setShowDropdown(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
        window.removeEventListener("scroll", p);
        window.removeEventListener("wheel", p);
        window.removeEventListener("touchmove", p);
        window.removeEventListener("mousewheel", p);
      };
    } else {
      document.body.style.overflowX = "unset";
      document.documentElement.style.scrollbarWidth = "unset";
    }
  }, [showDropdown]);
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        // padding: "1rem",
        paddingLeft: "1rem",
        backgroundColor: "#282c34",
        color: "white",
        margin: "0",
        height: "60px",
      }}
    >
      {isHome ? (
        <div
          style={{
            display: "flex",
            alignItems: "space-between",
            width: "100%",
          }}
        >
          <h1>Color by Number</h1>
        </div>
      ) : (
        <button
          onClick={goHome}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "0",
            fontSize: "1.5rem",
          }}
        >
          🏠
        </button>
      )}
      {isHome ? (
        <input
          type="text"
          placeholder="Search..."
          style={{
            marginLeft: "1rem",
            padding: "0.5rem",
            borderRadius: "4px",
            color: "white",
            backgroundColor: "transparent",
            height: "30px",
          }}
          value={search}
          onChange={handleSearchChange}
        />
      ) : null}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <MountainSnowIcon color="white" />
      </button>
      <WallpaperDropdown
        visible={showDropdown}
        styles={{ top: "60px", right: "0" }}
      />
    </nav>
  );
};

export default Header;
