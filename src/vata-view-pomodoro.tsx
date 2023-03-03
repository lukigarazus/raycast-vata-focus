import React from "react";
import { Detail, List } from "@raycast/api";
import { ActionPanel, Action, LaunchProps } from "@raycast/api";
import { getPomodoroControls, IExtensionState, useExtensionState } from "./hooks";
import { createMainWindowAction } from "./utils";
import { PomodoroMainWindowType } from "./types";

const typeToComponent: Record<PomodoroMainWindowType, (extensionState: IExtensionState) => React.ReactNode> = {
  [PomodoroMainWindowType.CONTROL]: (extensionState) => (
    <List>
      {getPomodoroControls(extensionState).map(({ title, icon, onAction }) => (
        <List.Item
          key={title}
          title={title}
          icon={icon}
          actions={
            <ActionPanel>
              <Action title={title} onAction={createMainWindowAction(onAction)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  ),
  [PomodoroMainWindowType.SESSION_END]: () => <Detail markdown="## Session ended!" />,
};

export default ({ launchContext }: LaunchProps<{ launchContext?: { type: PomodoroMainWindowType } }>) => {
  const extensionState = useExtensionState();

  return typeToComponent[launchContext?.type || PomodoroMainWindowType.CONTROL](extensionState);
};
