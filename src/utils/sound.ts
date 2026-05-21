const sounds = import.meta.glob("../assets/sounds/*.{mp3,wav,ogg}", {
  eager: true,
  query: "?url",
  import: "default",
});

const soundList = Object.values(sounds) as string[];

export function playRandomSound() {
  const volume = Number(localStorage.getItem("volume") ?? "1");

  const sounds = import.meta.glob("../assets/sounds/*.{mp3,wav,ogg}", {
    eager: true,
    query: "?url",
	import: "default",
  });

  const list = Object.values(sounds) as string[];
  if (!list.length) return;

  const audio = new Audio(list[Math.floor(Math.random() * list.length)]);
  audio.volume = volume;

  audio.play();
}