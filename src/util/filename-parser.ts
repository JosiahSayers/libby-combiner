export function findAudioFiles(files: string[]) {
  return files.filter((file) => file.toLowerCase().endsWith(".mp3"));
}
