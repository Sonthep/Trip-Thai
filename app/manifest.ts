import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl()

  return {
    name: "TripThai - วางแผน Road Trip ทั่วไทย",
    short_name: "TripThai",
    description:
      "คำนวณเส้นทาง เวลาเดินทาง ค่าน้ำมัน และงบรวมทั้งทริป พร้อมแนะนำทริปตามภาค",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#0d9668",
    categories: ["travel", "navigation", "lifestyle"],
    lang: "th",
    id: siteUrl,
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}
