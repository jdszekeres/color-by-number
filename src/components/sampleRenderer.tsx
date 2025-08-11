import React from "react";
import { Item } from "../types";
const SampleRenderer = ({
  item,
  completed,
}: {
  item: Item;
  completed: boolean;
}) => {
  const width = item.drawing[0].length;
  const height = item.drawing.length;
  const cellSize = 128 / Math.min(width, height);
  return (
    <div
      style={{
        margin: "1rem",
        textAlign: "center",
        // backdropFilter: "blur(5px)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "fit-content",
          margin: "0 auto",
        }}
      >
        {completed && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              fontSize: "1.5rem",
              padding: "0",
            }}
          >
            ✅
          </div>
        )}
        {completed && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "128px",
              height: "128px",
              background: "rgba(0,0,0,0.5)",
            }}
          ></div>
        )}
        <table
          style={{ borderCollapse: "collapse", margin: "1rem auto" }}
          cellPadding={0}
          cellSpacing={0}
        >
          <tbody>
            {item.drawing.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((color, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      backgroundColor: item.colors[color],
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      padding: "0",
                      margin: "0",
                    }}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.7)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          {item.name}
        </div>
      </div>
    </div>
  );
};

export default SampleRenderer;
