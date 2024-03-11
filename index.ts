import { combineAudioFiles } from "./src/combine";
import { gatherAudioFiles } from "./src/gather";
import { readOpenbook } from "./src/read-openbook";
import { validateDirectory } from "./src/validate-directory";
import { writeMetadata } from "./src/write-metadata";
import { join } from "node:path";

const directory = Bun.argv[2];
const files = await validateDirectory(directory);

// Gather mp3 files metadata
const audioFiles = await gatherAudioFiles(directory, files);
console.log(`Found ${Object.keys(audioFiles).length} mp3 files`);

// Parse openbook.json
const openbook = await readOpenbook(directory, audioFiles);

// Combine mp3s
await combineAudioFiles(
  directory,
  audioFiles.map((file) => file.filename),
  openbook
);

// Store metadata in new mp3
await writeMetadata(directory, openbook);

console.log(`Successfully wrote file: ${join(directory, openbook.title)}.mp3`);
