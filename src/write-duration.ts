import NodeID3 from "node-id3";
import { join } from "node:path";
import type { AudioFile } from "./gather";

export async function writeDurations(directory: string, files: AudioFile[]) {
  console.log("Writing durations to split audio files");
  for (const file of files) {
    const path = join(directory, file.filename);
    NodeID3.write({ length: file.duration.toString() }, path, (err) => {
      if (err) console.error(err);
    });
  }
}
