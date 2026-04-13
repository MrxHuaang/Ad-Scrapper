import { redirect } from "next/navigation";

export default function RootPage() {
  // TODO: check session — redirect to /login if unauthenticated
  redirect("/search");
}
