import { join } from "node:path";
import NodeID3 from "node-id3";
import type { OpenBook } from "./read-openbook";

export async function writeMetadata(directory: string, openbook: OpenBook) {
  NodeID3.write(
    {
      title: openbook.title,
      album: openbook.title,
      composer: openbook.narrator,
      performerInfo: openbook.author,
      comment: { language: openbook.language, text: openbook.description },
      genre: "Audiobook",
      tableOfContents: [
        {
          elementID: "TOC",
          isOrdered: true,
          elements: openbook.chapters.map((_, index) => `chp${index}`),
        },
      ],
      chapter: openbook.chapters.map((chapter, index) => ({
        elementID: `chp${index}`,
        startTimeMs: chapter.startTimeMs,
        endTimeMs: chapter.startTimeMs + chapter.durationMs - 1,
        tags: {
          title: chapter.title,
        },
      })),
      image: join(directory, "cover.jpg"),
    },
    join(directory, `${openbook.title}.mp3`),
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}
