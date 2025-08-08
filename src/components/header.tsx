import React from "react";
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
    </nav>
  );
};

export default Header;
