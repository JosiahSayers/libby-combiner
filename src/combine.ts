import { join } from "node:path";
import { unlink } from "node:fs/promises";

export async function combineAudioFiles(
  directory: string,
  files: string[],
  openbook: any
) {
  console.log("Combining MP3 files. This may take a few minutes.");
  if (!(await validateFfmpegPresence())) {
    console.error(
      "ffmpeg is not present on this system. Please install it to be able to combine mp3 files."
    );
    return;
  }
  await writeFileList(directory, files);
  await combineFiles(directory, `${openbook.title}.mp3`);
  await cleanup(directory);
}

async function validateFfmpegPresence() {
  return new Promise<boolean>((resolve, reject) => {
    Bun.spawn(["which", "ffmpeg"], {
      onExit(proc, exitCode, signalCode, error) {
        resolve(exitCode === 0);
      },
    });
  });
}

async function writeFileList(directory: string, files: string[]) {
  const lines = files.map((file) => `file '${file}'`);
  return Bun.write(join(directory, "files.txt"), lines.join("\n"));
}

function combineFiles(directory: string, title: string) {
  return new Promise<void>((resolve, reject) => {
    Bun.spawn(
      [
        "ffmpeg",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "files.txt",
        "-c",
        "copy",
        title,
      ],
      {
        onExit(proc, exitCode, signalCode, error) {
          if (exitCode === 0) {
            resolve();
          }
          reject(error);
        },
        cwd: directory,
      }
    );
  });
}

async function cleanup(directory: string) {
  return unlink(join(directory, "files.txt"));
}
