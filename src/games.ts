import game1 from "../images.json";
import game2 from "../game.json";

const games = [...game1.map(e => ({ ...e, type: "image" })), ...game2.map(e => ({ ...e, type: "drawing" }))];
export default games;