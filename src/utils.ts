import { popToRoot, closeMainWindow, launchCommand, LaunchType } from "@raycast/api";
import { POMODORO_MENU_ITEM, POMODORO_MAIN_WINDOW, PROJECTS_MENU_ITEM } from "./constants";
import { PomodoroMainWindowType } from "./types";

export const launchPomodoroMenuItem = () => {
  launchCommand({ name: POMODORO_MENU_ITEM, type: LaunchType.UserInitiated });
};

export const launchPomodoroView = () => {
  launchCommand({
    name: POMODORO_MAIN_WINDOW,
    type: LaunchType.UserInitiated,
    context: { type: PomodoroMainWindowType.CONTROL },
  });
};

export const launchPomodoroSessionEndView = () => {
  launchCommand({
    name: POMODORO_MAIN_WINDOW,
    type: LaunchType.UserInitiated,
    context: { type: PomodoroMainWindowType.SESSION_END },
  });
};

export const launchMainProjectMenuItem = () => {
  launchCommand({ name: PROJECTS_MENU_ITEM, type: LaunchType.UserInitiated });
};

export const createMainWindowAction = (action: () => void) => () => {
  action();
  launchPomodoroMenuItem();
  popToRoot();
  closeMainWindow();
};
