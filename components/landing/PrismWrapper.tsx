"use client";

import dynamic from "next/dynamic";

const Prism = dynamic(() => import("@/components/landing/Prism"), {
  ssr: false,
});

export function PrismWrapper(props: React.ComponentProps<typeof import("@/components/landing/Prism").default>) {
  return <Prism {...props} />;
}
