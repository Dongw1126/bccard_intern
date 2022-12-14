// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Notification, User, MyProject, Project } = initSchema(schema);

export {
  Notification,
  User,
  MyProject,
  Project
};