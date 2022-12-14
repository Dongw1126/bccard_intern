import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type NotificationMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MyProjectMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ProjectMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Notification {
  readonly id: string;
  readonly content?: string | null;
  readonly confirmed?: boolean | null;
  readonly senderId?: string | null;
  readonly receiverId?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Notification, NotificationMetaData>);
  static copyOf(source: Notification, mutator: (draft: MutableModel<Notification, NotificationMetaData>) => MutableModel<Notification, NotificationMetaData> | void): Notification;
}

export declare class User {
  readonly id: string;
  readonly userId: string;
  readonly nickname: string;
  readonly email: string;
  readonly avatar?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

export declare class MyProject {
  readonly id: string;
  readonly userId?: string | null;
  readonly project?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<MyProject, MyProjectMetaData>);
  static copyOf(source: MyProject, mutator: (draft: MutableModel<MyProject, MyProjectMetaData>) => MutableModel<MyProject, MyProjectMetaData> | void): MyProject;
}

export declare class Project {
  readonly id: string;
  readonly users?: (string | null)[] | null;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly deadline?: string | null;
  readonly overview?: (number | null)[] | null;
  readonly kanban?: string | null;
  readonly emoji?: string | null;
  readonly openPublic?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Project, ProjectMetaData>);
  static copyOf(source: Project, mutator: (draft: MutableModel<Project, ProjectMetaData>) => MutableModel<Project, ProjectMetaData> | void): Project;
}