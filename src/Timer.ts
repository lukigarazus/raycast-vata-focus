export interface ITimerEvent {
  left: number;
}

export interface ITimerJSON extends ITimerEvent {
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
  presentation: () => string;
}

class Timer implements ITimer {
  static toJSON = (timer: ITimer) => {
    const { duration, startedAt, pausedAt, endedAt, stale, left, lastUpdatedAt } = timer;
    const timerJSON: ITimerJSON = {
      // id,
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
    const { duration, startedAt, pausedAt, endedAt, stale, left, lastUpdatedAt } = timerJSON;
    const timer = new Timer(duration);
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

  public startedAt?: number;
  public pausedAt?: number;
  public endedAt?: number;
  public lastUpdatedAt?: number;
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
      // console.log(timeFlown / 1000, this.lastUpdatedAt, this.startedAt);
      const timeLeft = this.left - timeFlown;
      this.left = timeLeft > 0 ? timeLeft : 0;
      if (this.left === 0) {
        this.endedAt = now;
        delete this.pausedAt;
      }
      this.lastUpdatedAt = now;
    }
  };

  public presentation = () => {
    if (this.left === 0) {
      return "00:00";
    }
    const minutes = Math.floor(this.left / (60 * 1000));
    const seconds = +(this.left / 1000 - minutes * 60).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
}

export default Timer;
