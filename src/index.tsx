// import { useEffect, useState } from "react";
import { Icon, MenuBarExtra, open } from "@raycast/api";
// import { getFavicon } from "@raycast/utils";
import { useExtensionState } from "./hooks";

export default function Command() {
  const { startTimer, timerPresentation, pauseTimer, resumeTimer } = useExtensionState();
  console.log("RENDER");
  return (
    <MenuBarExtra title={timerPresentation}>
      <MenuBarExtra.Item
        title="New"
        onAction={(arg) => {
          if (arg.type === "left-click") startTimer(1000 * 60 * 25);
        }}
      />
      <MenuBarExtra.Item
        title="Pause"
        onAction={(arg) => {
          if (arg.type === "left-click") pauseTimer(undefined);
        }}
      />
      <MenuBarExtra.Item
        title="Resume"
        onAction={(arg) => {
          if (arg.type === "left-click") resumeTimer(undefined);
        }}
      />
    </MenuBarExtra>
  );
}
