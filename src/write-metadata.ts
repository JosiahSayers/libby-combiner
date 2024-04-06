import { join } from "node:path";
import NodeID3 from "node-id3";
import type { OpenBook } from "./read-openbook";
import { getDuration } from "./util/get-mp3-duration";

export async function writeMetadata(directory: string, openbook: OpenBook) {
  const path = join(directory, `${openbook.title}.mp3`);
  const duration = await getDuration(path);
  NodeID3.write(
    {
      title: openbook.title,
      album: openbook.title,
      composer: openbook.narrator,
      artist: openbook.author,
      comment: { language: openbook.language, text: openbook.description },
      genre: "Audiobook",
      tableOfContents: [
        {
          elementID: "TOC",
          isOrdered: true,
          elements: openbook.chapters.map((_, index) => `chp${index}`),
        },
      ],
      chapter: openbook.chapters.map((chapter, index) => {
        return {
          elementID: `chp${index}`,
          startTimeMs: chapter.startTimeMs,
          endTimeMs: chapter.endTimeMs ?? duration,
          tags: {
            title: chapter.title,
          },
        };
      }),
      image: join(directory, "cover.jpg"),
      length: duration.toString(),
    },
    path,
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}
