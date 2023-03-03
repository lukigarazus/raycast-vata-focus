import { randomUUID } from "crypto";

export interface IProject {
  id: string;
  name: string;
  description: string;
  sessions: number;
  sessionsInARow: number;
  lastSession: Date | undefined;
}

export interface IProjectJSON extends Omit<IProject, "lastSession"> {
  lastSession: string | undefined;
}

export class Project implements IProject {
  static toJSON = (project: IProject): IProjectJSON => {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      sessions: project.sessions,
      sessionsInARow: project.sessionsInARow,
      lastSession: project.lastSession?.toISOString?.(),
    };
  };

  static fromJSON = (projectJSON: IProjectJSON): IProject => {
    const project = new Project(
      projectJSON.name,
      projectJSON.description,
      projectJSON.lastSession ? new Date(projectJSON.lastSession) : undefined,
      projectJSON.sessions,
      projectJSON.sessionsInARow
    );
    project.id = projectJSON.id;

    return project;
  };

  public id: string = randomUUID();
  public name: string;
  public description: string;
  public sessions: number;
  public sessionsInARow: number;
  public lastSession: Date | undefined = undefined;

  constructor(
    name: string,
    description: string,
    lastSession: Date | undefined = undefined,
    sessions = 0,
    sessionsInARow = 0
  ) {
    this.name = name;
    this.description = description;
    this.lastSession = lastSession;
    this.sessions = sessions;
    this.sessionsInARow = sessionsInARow;
  }
}
