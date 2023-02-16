import { useState, useMemo, useCallback } from "react";
import State, { IState } from "./State";

export interface ITimerState {
  passed: number;
  left: number;
}

export enum TimerPresentationTypeEnum {
  LEFT,
  PASSED,
}

export const useExtensionState = () => {
  const [state, setState] = useState<IState>(State.load());
  const [tick, setTick] = useState(0);

  const timerPresentation = useMemo(() => {
    if (!state.timer) {
      return "--:--";
    }
    if (state.timer.left === 0) {
      return "00:00";
    }
    const minutes = Math.floor(state.timer.left / (60 * 1000));
    const seconds = +(state.timer?.left / 1000 - minutes * 60).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, [state.timer]);

  const startTimer = useCallback(
    (duration: number) => {
      state.createTimer(duration);
      state.startTimer();
      setTick((tick) => tick + 1);
    },
    [state]
  );

  const pauseTimer = useCallback(() => {
    state.pauseTimer();
    setTick((tick) => tick + 1);
  }, [state]);

  const resumeTimer = useCallback(() => {
    state.resumeTimer();
    setTick((tick) => tick + 1);
  }, [state]);

  return {
    startTimer,
    pauseTimer,
    resumeTimer,
    timerPresentation,
  };
};
