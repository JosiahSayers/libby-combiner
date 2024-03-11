import getDuration from "get-mp3-duration";
import { join } from "node:path";
import { findAudioFiles } from "./util/filename-parser";

export interface AudioFile {
  filename: string;
  duration: number;
  startTime: number;
}

export async function gatherAudioFiles(
  directory: string,
  files: string[]
): Promise<AudioFile[]> {
  const audioFiles = findAudioFiles(files);
  audioFiles.sort((a, b) => getPart(a) - getPart(b));
  const durations = await Promise.all(
    audioFiles.map((file) => readFile(directory, file))
  );
  const durationsWithStart = durations.map((duration, index) => {
    const previousDurations = durations.slice(0, index);
    const previousDurationSum = previousDurations.reduce((acc, curr) => {
      return acc + curr.duration;
    }, 0);
    return {
      ...duration,
      startTime: previousDurationSum,
    };
  });
  return durationsWithStart;
}

function getPart(filename: string) {
  const results = /-Part(?<part>\d*).mp3/.exec(filename);
  const part = results?.groups?.part || "0";
  return parseInt(part);
}

async function readFile(directory: string, filename: string) {
  const path = join(directory, filename);
  const file = Bun.file(path);
  const arrayBuffer = await file.arrayBuffer();
  const duration = getDuration(Buffer.from(arrayBuffer));
  return { duration, filename };
}
