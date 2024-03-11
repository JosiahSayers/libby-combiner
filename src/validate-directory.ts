import { readdir } from "node:fs/promises";
import { findAudioFiles } from "./util/filename-parser";

const requiredFiles = ["openbook.json"];

export async function validateDirectory(directory: string) {
  if (!directory) {
    console.error(
      "No directory provided. Please pass a directory when running the program."
    );
    process.exit(1);
  }

  const files = await readdir(directory);
  if (!files.includes("openbook.json")) {
    announceMissing("openbook.json", true);
  }

  if (!files.includes("cover.jpg")) {
    announceMissing("cover.jpg");
  }

  const audioFiles = findAudioFiles(files);
  if (audioFiles.length === 0) {
    console.error("No mp3 files found in directory.");
    process.exit(1);
  }

  return files;
}

function announceMissing(file: string, exit = false) {
  const logger = exit ? console.error : console.warn;
  logger(`Missing file: "${file}"`);
  if (exit) {
    process.exit(1);
  }
}
