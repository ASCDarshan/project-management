// src/services/appwriteConfig.js
import {
  Client,
  Account,
  Databases,
  Teams,
  Avatars,
  Storage,
  ID,
  Query,
} from "appwrite";

const client = new Client();

const APPWRITE_ENDPOINT = "http://localhost/v1";
const APPWRITE_PROJECT_ID = "your_project_id";
const APPWRITE_DATABASE_ID = "your_database_id";

client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const teams = new Teams(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);

export const APPWRITE_CONFIG = {
  DATABASE_ID: APPWRITE_DATABASE_ID,
  PROJECTS_COLLECTION_ID: "projects",
  TASKS_COLLECTION_ID: "tasks",
  MILESTONES_COLLECTION_ID: "milestones",
  PROJECT_TEAMS_COLLECTION_ID: "project_teams",
  USERS_COLLECTION_ID: "users_profile", // Optional, if you plan to use it
};

// Export ID and Query for easy access
export { ID, Query };
