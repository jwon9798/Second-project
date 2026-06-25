import { getSiteUrl } from "@/lib/site";

export default function manifest() {
  return {
    name: "ClipQuiz",
    short_name: "ClipQuiz",
    description: "Global image, crop & music guessing quizzes",
    start_url: "/en",
    display: "standalone",
    background_color: "#07080f",
    theme_color: "#07080f",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    id: getSiteUrl(),
  };
}
