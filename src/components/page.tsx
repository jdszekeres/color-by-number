import React, { useEffect, useState } from "react";
import { Item } from "../types";
import { useProgress } from "../contexts/progressContext";
function chooseTextColor(t) {
  let e = t.replace("#", ""),
    r = parseInt(e.substring(0, 2), 16),
    s = parseInt(e.substring(2, 4), 16),
    n = parseInt(e.substring(4, 6), 16);
  return (0.299 * r + 0.587 * s + 0.114 * n) / 255 > 0.5 ? "black" : "white";
}

const Page = (item: Item) => {
  const { progress, setProgress } = useProgress();
  const drawingColors = item.colors;

  const [drawing, setDrawing] = useState(
    item.drawing.map((row) => [...row.map((color) => drawingColors[color])])
  );
  const [drawingMask, setDrawingMask] = useState(
    Array.from({ length: item.drawing.length }, () =>
      Array(item.drawing[0].length).fill(0)
    )
  );

  useEffect(() => {
    const allGood = drawingMask.every((row) =>
      row.every((color) => color === 1)
    );
    if (allGood) {
      setProgress(item.name as keyof typeof progress, true);
      alert("Congratulations! You've completed the drawing!");
    }
  }, [drawingMask]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const width = drawing[0].length;
  const height = drawing.length;

  return (
    <>
      <div
        id="pallette"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(20, minmax(1px, 1fr))",
          gap: "0.5rem",
        }}
      >
        {Object.entries(drawingColors).map(([color, hex]) => (
          <div
            key={color}
            style={{
              backgroundColor: hex,
              color: chooseTextColor(hex),
              padding: "1rem",
              margin: "0.25rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedColor(color);
            }}
          >
            {color.padStart(2, "0")}
          </div>
        ))}
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}
      >
        <table
          id="drawing-container"
          cellSpacing="0"
          cellPadding="0"
          style={{ borderCollapse: "collapse" }}
        >
          <tbody>
            {drawing.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((color, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      color:
                        drawingMask[rowIndex][colIndex] === 1
                          ? "transparent"
                          : chooseTextColor(
                              drawingMask[rowIndex][colIndex] === 1
                                ? color
                                : drawingMask[rowIndex][colIndex] === 0
                                ? "gray"
                                : drawingMask[rowIndex][colIndex]
                            ),
                      backgroundColor:
                        drawingMask[rowIndex][colIndex] === 1
                          ? color
                          : drawingMask[rowIndex][colIndex] === 0
                          ? "gray"
                          : drawingMask[rowIndex][colIndex],
                      width: `calc(85vh / ${Math.max(width, height)})`,
                      height: `calc(85vh / ${Math.max(width, height)})`,
                      padding: "0",
                      margin: "0",
                      cursor: "pointer",
                      border: "1px solid #ccc",
                      aspectRatio: "1 / 1",
                    }}
                    onMouseOver={() => {
                      if (
                        selectedColor &&
                        drawingMask[rowIndex][colIndex] !== 1
                      ) {
                        const newMask = [...drawingMask];
                        newMask[rowIndex][colIndex] =
                          drawingColors[selectedColor] === color
                            ? 1
                            : `color-mix(in srgb, ${drawingColors[selectedColor]}, gray)`;
                        setDrawingMask(newMask);
                      }
                    }}
                  >
                    {Object.entries(drawingColors)
                      .find(([colorId, hex]) => hex === color)?.[0]
                      .padStart(2)}

                    {/* {drawingMask[rowIndex][colIndex] === 1
                      ? color
                      : drawingMask[rowIndex][colIndex] === 0
                      ? "gray"
                      : drawingMask[rowIndex][colIndex]} */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Page;
