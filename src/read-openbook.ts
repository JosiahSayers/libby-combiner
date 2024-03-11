import { join } from "node:path";
import type { AudioFile } from "./gather";

export interface OpenBook {
  title: string;
  author: string;
  narrator: string;
  language: string;
  description: string;
  chapters: Chapter[];
}

interface Chapter {
  title: string;
  startTimeMs: number;
  startTime: string;
  podWiseTimestamp: string;
  durationMs: number;
}

export async function readOpenbook(
  directory: string,
  audioFiles: AudioFile[]
): Promise<OpenBook> {
  const file = Bun.file(join(directory, "openbook.json"));
  const data = await file.json();

  return {
    title: data?.title?.main?.trim() ?? "unknown title",
    author: getCreator(data, "author"),
    narrator: getCreator(data, "narrator"),
    language: data?.language?.trim() ?? "unknown language",
    description: data?.description?.full?.trim() ?? "",
    chapters: getChapters(data, audioFiles),
  };
}

function getCreator(data: any, creatorType: "author" | "narrator") {
  const authorObject = data?.creator?.find(
    (creator: any) => creator.role === creatorType
  );
  return authorObject?.name?.trim() ?? `unknown ${creatorType}`;
}

function getChapters(data: any, audioFiles: AudioFile[]) {
  const chapters = data?.nav?.toc ?? [];
  const reg = /Part\d*/;
  const mappedChapters = chapters.map((chapter: any) => {
    const part = chapter.path.match(reg)[0];
    const chapterStartInFile = getChapterStartTime(chapter.path);
    const audioFile = audioFiles.find((file) => file.filename.includes(part));
    const chapterStart = (audioFile?.startTime ?? 0) + chapterStartInFile;
    const startTime = formatStart(chapterStart / 1000);
    const podWiseTimestamp = `${startTime} ${chapter.title}`;

    return {
      title: chapter.title,
      startTimeMs: chapterStart,
      startTime,
      podWiseTimestamp,
      durationMs: audioFile?.duration,
    };
  });

  return mappedChapters;
}

function getChapterStartTime(chapter: string) {
  const durationSearch = ".mp3#";
  if (chapter.includes(durationSearch)) {
    const durationString = chapter.split(durationSearch).at(-1) as string;
    const duration = parseInt(durationString);
    return duration * 1000;
  }

  return 0;
}

function formatStart(totalSeconds: number) {
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let remaining = totalSeconds;

  while (remaining > 0) {
    if (remaining >= 3600) {
      hours++;
      remaining -= 3600;
    } else if (remaining >= 60) {
      minutes++;
      remaining -= 60;
    } else {
      seconds = remaining;
      remaining = 0;
    }
  }

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const closestSecond = Math.round(seconds);
  const formattedSeconds =
    closestSecond < 10 ? `0${closestSecond}` : closestSecond;
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
