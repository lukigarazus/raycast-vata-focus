import { Cache } from "@raycast/api";
import Timer, { ITimer, ITimerJSON } from "./Timer";

export interface IState {
  timer?: ITimer;
  createTimer: (duration: number) => ITimer;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
}

export interface IStateJSON {
  timer?: ITimerJSON;
}

const cache = new Cache();

class State implements IState {
  static cacheKey = "vata-focus-state";

  static toString = (state: IState) => {
    const stateJSON: IStateJSON = {
      timer: state.timer ? Timer.toJSON(state.timer) : undefined,
    };
    return JSON.stringify(stateJSON);
  };

  static fromString = (str: string): IState => {
    const stateJSON = JSON.parse(str) as IStateJSON;
    const state = new State();
    if (stateJSON.timer) {
      state.timer = Timer.fromJSON(stateJSON.timer);
      state.updateTimer();
    }
    return state;
  };

  static save = (state: IState) => {
    const str = State.toString(state);
    cache.set(State.cacheKey, str);
  };

  static load = () => {
    const str = cache.get(State.cacheKey);
    if (str) {
      return State.fromString(str);
    } else {
      return new State();
    }
  };

  public timer?: ITimer;

  //   constructor() {}

  public createTimer = (duration: number) => {
    this.timer = new Timer(duration);
    return this.timer;
  };

  public startTimer = () => {
    this.timer?.start();
    State.save(this);
  };

  public pauseTimer = () => {
    this.timer?.pause();
    State.save(this);
  };

  public resumeTimer = () => {
    this.timer?.resume();
    State.save(this);
  };

  public updateTimer = () => {
    this.timer?.update();
    State.save(this);
  };
}

export default State;
