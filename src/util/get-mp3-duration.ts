import getMp3Duration from "get-mp3-duration";

export async function getDuration(pathToFile: string): Promise<number> {
  const file = Bun.file(pathToFile);
  const arrayBuffer = await file.arrayBuffer();
  const duration = getMp3Duration(Buffer.from(arrayBuffer));
  return duration;
}
