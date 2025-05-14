// src/services/projectService.js
import { databases, ID, Query, APPWRITE_CONFIG } from "./appwriteConfig";
import { teams } from "./appwriteConfig"; // For team management if needed

export const projectService = {
  async createProject(data) {
    try {
      // Data should include: name, description, startDate, endDate, ownerId, status
      // Potentially create an Appwrite team for this project here
      // const projectTeam = await teams.create(ID.unique(), `${data.name} Team`);
      // const projectData = { ...data, teamId: projectTeam.$id };

      const projectData = { ...data }; // Simplify for now, team integration later

      const response = await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.PROJECTS_COLLECTION_ID,
        ID.unique(),
        projectData
      );
      // If team created:
      // Add owner to the team with an 'admin' or 'owner' role
      // await teams.createMembership(projectTeam.$id, ['owner'], data.ownerId, undefined, `${window.location.origin}/project/${response.$id}?membership=success`);

      return response;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  async getProject(id) {
    try {
      return await databases.getDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.PROJECTS_COLLECTION_ID,
        id
      );
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  },

  async listProjects(userId, isAdmin) {
    try {
      const queries = [Query.orderDesc("$createdAt")];

      // RBAC: If not admin, filter projects.
      // This requires 'ownerId' to be queryable and/or using Appwrite permissions
      // or team memberships effectively.
      // For now, a simple ownerId check if the user is not an admin.
      // A more robust way is to rely on Appwrite's collection/document permissions
      // which automatically filter. If you set read access to `user:{ownerId}` or `team:{teamId}`,
      // Appwrite will only return documents the current user has access to.
      // The query below is an additional client-side filter idea if needed.

      // If your Appwrite permissions are set correctly, you might not need this explicit query:
      // if (!isAdmin && userId) {
      //   queries.push(Query.equal('ownerId', userId)); // Or Query.search('memberIds', userId) if you have such a field
      // }

      return await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.PROJECTS_COLLECTION_ID,
        queries
      );
    } catch (error) {
      console.error("Error listing projects:", error);
      throw error;
    }
  },

  async updateProject(id, data) {
    try {
      return await databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.PROJECTS_COLLECTION_ID,
        id,
        data
      );
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  async deleteProject(id) {
    try {
      // Consider related data: tasks, milestones, Appwrite team for the project
      // This might require Appwrite Functions for cascading deletes or careful client-side handling.
      return await databases.deleteDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.PROJECTS_COLLECTION_ID,
        id
      );
      // If an Appwrite team was created for this project:
      // await teams.delete(project.teamId);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  // Example: Add member to a project (simplified - relies on 'memberIds' array attribute in project)
  // A more robust approach is using Appwrite Teams per project.
  async addMemberToProject(projectId, userId, projectData) {
    try {
      const currentMembers = projectData.memberIds || [];
      if (!currentMembers.includes(userId)) {
        const updatedMembers = [...currentMembers, userId];
        return await this.updateProject(projectId, {
          memberIds: updatedMembers,
        });
      }
      return projectData; // No change
    } catch (error) {
      console.error("Error adding member to project:", error);
      throw error;
    }
  },

  // Example: Remove member from project (simplified)
  async removeMemberFromProject(projectId, userId, projectData) {
    try {
      const currentMembers = projectData.memberIds || [];
      const updatedMembers = currentMembers.filter(
        (memberId) => memberId !== userId
      );
      if (updatedMembers.length !== currentMembers.length) {
        return await this.updateProject(projectId, {
          memberIds: updatedMembers,
        });
      }
      return projectData; // No change
    } catch (error) {
      console.error("Error removing member from project:", error);
      throw error;
    }
  },
};
