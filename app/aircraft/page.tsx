import { redirect } from "next/navigation";

export default function AircraftRootPage() {
  // Keep a single dashboard surface: aircraft lives in /search as a tab.
  redirect("/search?tab=aircraft");
}

