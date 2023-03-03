import React from "react";
import { MenuBarExtra } from "@raycast/api";
import { useExtensionState } from "./hooks";

export default () => {
  const extensionState = useExtensionState();
  return extensionState.mainProjectPresentation ? (
    <MenuBarExtra title={extensionState.mainProjectPresentation} />
  ) : null;
};
