import { useState, useMemo, useCallback } from "react";
import { Icon } from "@raycast/api";
import State, { IState } from "./State";
import { SESSION_DURATION } from "./constants";
import { IProject } from "./Project";

export interface ITimerState {
  passed: number;
  left: number;
}

export enum TimerPresentationTypeEnum {
  LEFT,
  PASSED,
}

export interface IExtensionState {
  startTimer: (duration: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  timerPresentation: string;
  mainProjectPresentation: string | undefined;
  projects: IProject[];
  createProject: (props: { name: string; description: string }) => void;
  removeProject: (project: IProject) => void;
  setMainProject: (project: IProject) => void;
}

export const getPomodoroControls = (state: IExtensionState) => {
  return [
    {
      title: "New",
      icon: Icon.Plus,
      onAction: () => {
        state.startTimer(SESSION_DURATION);
      },
    },
    { title: "Pause", icon: Icon.Pause, onAction: state.pauseTimer },
    { title: "Resume", icon: Icon.Play, onAction: state.resumeTimer },
  ];
};

export const useExtensionState = (): IExtensionState => {
  const state = useMemo<IState>(() => State.load(), []);
  const [tick, setTick] = useState(0);
  const incrementTick = useCallback(() => setTick((tick) => tick + 1), []);

  const startTimer = useCallback(
    (duration: number) => {
      state.createTimer(duration);
      state.startTimer();
      incrementTick();
    },
    [state]
  );

  const pauseTimer = useCallback(() => {
    state.pauseTimer();
    incrementTick();
  }, [state]);

  const resumeTimer = useCallback(() => {
    state.resumeTimer();
    incrementTick();
  }, [state]);

  const createProject = useCallback(
    (props: { name: string; description: string }) => {
      state.createProject(props);
      incrementTick();
    },
    [state]
  );

  const removeProject = useCallback(
    (project: IProject) => {
      state.removeProject(project);
      incrementTick();
    },
    [state]
  );

  return {
    startTimer,
    pauseTimer,
    resumeTimer,
    timerPresentation: state.timerPresentation(),
    mainProjectPresentation: state.mainProjectPresentation(),
    projects: state.projects,
    createProject,
    removeProject,
    setMainProject: state.setMainProject,
  };
};
