import { randomUUID } from "crypto";

export interface ITimerEvent {
  left: number;
}

// type TimerCallback = (event: ITimerEvent) => void;

export interface ITimerJSON extends ITimerEvent {
  readonly id: string;
  readonly duration: number;
  readonly startedAt?: number;
  readonly pausedAt?: number;
  readonly lastUpdatedAt?: number;
  readonly endedAt?: number;
  stale: boolean;
}

export interface ITimer extends ITimerJSON {
  start: () => void;
  pause: () => void;
  update: () => void;
  resume: () => void;
}

class Timer implements ITimer {
  static toJSON = (timer: ITimer) => {
    const { id, duration, startedAt, pausedAt, endedAt, stale, left, lastUpdatedAt } = timer;
    const timerJSON: ITimerJSON = {
      id,
      duration,
      startedAt,
      pausedAt,
      endedAt,
      stale,
      left,
      lastUpdatedAt,
    };
    return timerJSON;
  };

  static fromJSON = (timerJSON: ITimerJSON) => {
    const { id, duration, startedAt, pausedAt, endedAt, stale, left, lastUpdatedAt } = timerJSON;
    const timer = new Timer(duration);
    timer.id = id;
    timer.startedAt = startedAt;
    timer.pausedAt = pausedAt;
    timer.endedAt = endedAt;
    timer.stale = stale;
    timer.left = left;
    timer.lastUpdatedAt = lastUpdatedAt;

    return timer;
  };

  static toString = (timer: ITimer) => JSON.stringify(Timer.toJSON(timer));

  static fromString = (str: string) => {
    const timerJSON = JSON.parse(str) as ITimerJSON;
    const timer = Timer.fromJSON(timerJSON);
    return timer;
  };

  public id = randomUUID();
  public startedAt?: number;
  public pausedAt?: number;
  public endedAt?: number;
  public lastUpdatedAt?: number;
  // public resumedAt?: number;
  public duration = 0;
  public stale = false;
  public left = 0;

  constructor(duration: number) {
    this.duration = duration;
    this.left = duration;
  }

  public start = () => {
    if (!this.endedAt && !this.startedAt) {
      const now = Date.now();
      this.startedAt = now;
      // this.resumedAt = now;
    }
  };

  public pause = () => {
    if (!this.pausedAt && !this.endedAt && this.startedAt) {
      this.update();
      this.pausedAt = Date.now();
      // this.resumedAt = undefined;
    }
  };

  public resume = () => {
    if (this.pausedAt && !this.endedAt && this.startedAt) {
      this.pausedAt = undefined;
      this.lastUpdatedAt = Date.now();
    }
  };

  public update = () => {
    if (!this.pausedAt && !this.endedAt && this.startedAt) {
      const now = Date.now();
      const timeFlown = now - (this.lastUpdatedAt || this.startedAt);
      console.log(timeFlown / 1000, this.lastUpdatedAt, this.startedAt);
      this.left = this.left - timeFlown;
      this.lastUpdatedAt = now;
    }
  };
}

export default Timer;
