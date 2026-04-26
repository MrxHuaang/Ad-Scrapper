import { redirect } from "next/navigation";

export default function AircraftRootPage() {
  // Single shell: aircraft tab is `/dashboard/aircraft`.
  redirect("/dashboard/aircraft");
}

