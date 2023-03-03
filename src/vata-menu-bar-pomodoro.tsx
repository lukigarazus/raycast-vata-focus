import { MenuBarExtra } from "@raycast/api";
import { useExtensionState, getPomodoroControls } from "./hooks";

export default function Command() {
  const extensionState = useExtensionState();
  return (
    <MenuBarExtra title={extensionState.timerPresentation}>
      {getPomodoroControls(extensionState).map(({ title, icon, onAction }) => (
        <MenuBarExtra.Item
          key={title}
          title={title}
          icon={icon}
          onAction={(arg) => {
            if (arg.type === "left-click") onAction();
          }}
        />
      ))}
    </MenuBarExtra>
  );
}
