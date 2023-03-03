import { Cache } from "@raycast/api";
import Timer, { ITimer, ITimerJSON } from "./Timer";
import { IProject, IProjectJSON, Project } from "./Project";
import { launchPomodoroSessionEndView, launchMainProjectMenuItem } from "./utils";

type ID = string;

export interface IState {
  timer?: ITimer;
  projects: IProject[];
  mainProject?: ID;
  createTimer: (duration: number) => ITimer;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  timerPresentation: () => string;
  mainProjectPresentation: () => string | undefined;
  createProject: (props: { name: string; description: string }) => IProject;
  removeProject: (project: IProject) => void;
  setMainProject: (project: IProject) => void;
}

export interface IStateJSON {
  timer?: ITimerJSON;
  projects: IProjectJSON[];
  mainProject?: ID;
}

const cache = new Cache();

class State implements IState {
  static cacheKey = "vata-focus-state";

  static toString = (state: IState) => {
    const stateJSON: IStateJSON = {
      timer: state.timer ? Timer.toJSON(state.timer) : undefined,
      projects: state.projects.map(Project.toJSON),
      mainProject: state.mainProject,
    };
    return JSON.stringify(stateJSON);
  };

  static fromString = (str: string): IState => {
    const stateJSON = JSON.parse(str) as IStateJSON;
    const state = new State();
    if (stateJSON.timer) {
      const timer = Timer.fromJSON(stateJSON.timer);
      state.timer = timer;
      state.updateTimer();
    }
    state.projects = (stateJSON.projects || []).map(Project.fromJSON);
    state.mainProject = stateJSON.mainProject;
    State.save(state);
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
  public projects: IProject[] = [];
  public mainProject?: ID;

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
    if (this.timer) {
      this.timer.update();

      if (this.timer.endedAt) {
        delete this.timer;
        launchPomodoroSessionEndView();
      }
    }

    State.save(this);
  };

  public timerPresentation = () => {
    return !this.timer ? "--:--" : this.timer.presentation();
  };

  public createProject = ({ name, description }: { name: string; description: string }) => {
    const project = new Project(name, description);
    this.projects.push(project);
    State.save(this);
    return project;
  };

  public setMainProject = (project: IProject) => {
    this.mainProject = project.id;
    State.save(this);
    launchMainProjectMenuItem();
  };

  public mainProjectPresentation = () => {
    if (!this.mainProject) {
      return undefined;
    }
    const project = this.projects.find((p) => p.id === this.mainProject);
    if (!project) {
      return undefined;
    }
    return project.name;
  };

  public removeProject = (project: IProject) => {
    this.projects = this.projects.filter((p) => p.id !== project.id);
    if (this.mainProject === project.id) {
      delete this.mainProject;
    }
    State.save(this);
  };
}

export default State;
