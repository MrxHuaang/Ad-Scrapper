"use client";

import { useMemo } from "react";

import { AvatarStack } from "@/components/avatar-stack";
import { useRealtimePresenceRoom } from "@/hooks/use-realtime-presence-room";
import { cn } from "@/lib/utils";

/** Shown when presence is empty or still syncing — avoids an invisible row. */
function PresencePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      aria-hidden
    >
      <div className="flex -space-x-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="size-9 rounded-full border border-white/15 bg-white/[0.07] ring-2 ring-black"
            style={{ zIndex: 3 - i }}
          />
        ))}
      </div>
    </div>
  );
}

export function RealtimeAvatarStack({
  roomName,
  className,
}: {
  roomName: string;
  className?: string;
}) {
  const { users: usersMap } = useRealtimePresenceRoom(roomName);
  const avatars = useMemo(() => {
    return Object.values(usersMap).map((user) => ({
      name: user.name ?? "Guest",
      image: user.image ?? "",
    }));
  }, [usersMap]);

  if (avatars.length === 0) {
    return <PresencePlaceholder className={className} />;
  }

  return <AvatarStack avatars={avatars} className={className} />;
}
