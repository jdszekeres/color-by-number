import React, { useEffect, useState, useMemo } from "react";
import { Item } from "../types";
import { useProgress } from "../contexts/progressContext";

const Page = (item: Item) => {
  const { progress, setProgress } = useProgress();
  const drawingColors = item.colors;

  // Map numeric drawing indices to hex strings, asserting defined values
  const drawing: string[][] = item.drawing.map((row) =>
    row.map((color) => drawingColors[color]!)
  );

  const [drawingMask, setDrawingMask] = useState(
    Array.from({ length: item.drawing.length }, () =>
      Array(item.drawing[0].length).fill(0)
    )
  );

  const [total_per_color, set_total_per_color] = useState<
    Record<string, number>
  >(() => {
    // Count all occurrences of each hex in the drawing
    const counts: Record<string, number> = {};
    drawing.forEach((row) => {
      row.forEach((hex) => {
        counts[hex] = (counts[hex] ?? 0) + 1;
      });
    });
    return counts;
  });

  // Compute colored counts based on drawingMask
  const colored = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    Object.values(drawingColors).forEach((hex) => {
      if (hex) counts[hex] = 0;
    });
    drawingMask.forEach((row, rowIndex) => {
      row.forEach((maskVal, colIndex) => {
        if (maskVal === 1) {
          const hex = drawing[rowIndex][colIndex];
          counts[hex] = (counts[hex] ?? 0) + 1;
        }
      });
    });
    return counts;
  }, [drawingMask, drawing]);

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

  // Calculate cell size to fit the image properly within 85vh
  const aspectRatio = width / height;
  const isWide = aspectRatio > 1;

  // If image is wide, base size on width; if tall, base on height
  const cellSize = isWide ? `calc(85vh / ${height})` : `calc(85vh / ${height})`;

  // For wide images, we might need to limit by viewport width instead
  const maxCellSizeByWidth = `calc(85vw / ${width})`;
  const finalCellSize =
    isWide && width > height * 1.5
      ? `min(${cellSize}, ${maxCellSizeByWidth})`
      : cellSize;

  function chooseTextColor(t: string): string {
    let e = t.replace("#", ""),
      r = parseInt(e.substring(0, 2), 16),
      s = parseInt(e.substring(2, 4), 16),
      n = parseInt(e.substring(4, 6), 16);

    return (0.299 * r + 0.587 * s + 0.114 * n) / 255 > 0.5 ? "black" : "white";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "start",
        padding: "1rem",
      }}
    >
      <div
        id="pallette"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(1px, 1fr))",
          gap: "0.5rem",
          width: "10%",
          minWidth: "200px",
        }}
      >
        {Object.entries(drawingColors).map(([color, hex]) =>
          // Don't show if no uncolored pixels of that color remain
          drawing.some((row, rowIndex) =>
            row.some(
              (c, colIndex) =>
                c === hex && drawingMask[rowIndex][colIndex] !== 1
            )
          ) ? (
            <div
              key={color}
              style={{
                backgroundColor: hex,
                color: chooseTextColor(hex!),
                padding: "1rem",
                borderRadius: "4px",
                cursor: "pointer",
                aspectRatio: "1 / 1",
                height: "auto",

                borderWidth: "2px",
                borderStyle: "solid",
                borderImageSource: `conic-gradient(${hex} 0%, ${hex} ${
                  (colored[hex!] / total_per_color[hex!]) * 100
                }%, ${chooseTextColor(hex!)} ${
                  (colored[hex!] / total_per_color[hex!]) * 100
                }%,  ${chooseTextColor(hex!)} 100%)`,
                borderImageSlice: 1,
                boxShadow:
                  selectedColor === color ? `0 0 0 4px ${hex}` : "none",
                textAlign: "center",
              }}
              onClick={() => {
                setSelectedColor(color);
              }}
            >
              {color.padStart(2, "0")}
            </div>
          ) : null
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: isWide ? "start" : "center",
          marginTop: "1rem",
          width: "90%",
          maxWidth: "calc(100% - 200px)",
        }}
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
                    className={
                      drawingColors[selectedColor ?? "-1"] === color &&
                      drawingMask[rowIndex][colIndex] !== 1
                        ? "blink"
                        : ""
                    }
                    style={{
                      color:
                        drawingMask[rowIndex][colIndex] === 1
                          ? "transparent"
                          : drawingColors[selectedColor ?? "-1"] === color
                          ? color
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
                      width: finalCellSize,
                      height: finalCellSize,
                      padding: "0",
                      margin: "0",
                      cursor: "pointer",
                      fontSize: `calc(${finalCellSize} * ${
                        color?.length == 2 ? "0.5" : "1"
                      })`,
                      border:
                        drawingMask[rowIndex][colIndex] !== 1
                          ? "1px solid #ccc"
                          : `1px solid ${color}`,
                      aspectRatio: "1 / 1 !important",
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
    </div>
  );
};

export default Page;
