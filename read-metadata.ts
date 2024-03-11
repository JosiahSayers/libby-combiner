import NodeID3 from "node-id3";
import { join } from "node:path";

const tags = NodeID3.read(
  join(
    "/Volumes",
    "Books",
    "audiobooks",
    "James S. A. Corey",
    "Leviathan Wakes.mp3"
  )
);
Bun.write("leviathan-wakes.json", JSON.stringify(tags, null, 2));

const tagsTwo = NodeID3.read(
  join("/Users/josiah/Downloads/Leviathan Falls", "Leviathan Falls.mp3")
);
Bun.write("leviathan-wakes.json", JSON.stringify(tags, null, 2));
Bun.write("leviathan-falls.json", JSON.stringify(tagsTwo, null, 2));
// console.log(tags);
