// src/services/taskService.js
import {
  databases,
  ID,
  Query,
  storage,
  APPWRITE_CONFIG,
} from "./appwriteConfig";

export const taskService = {
  async createTask(taskData) {
    try {
      // taskData should include: title, projectId, creatorId, status, priority
      // Optional: description, milestoneId, assigneeId, dueDate
      return await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.TASKS_COLLECTION_ID,
        ID.unique(),
        taskData
      );
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async getTask(taskId) {
    try {
      return await databases.getDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.TASKS_COLLECTION_ID,
        taskId
      );
    } catch (error) {
      console.error("Error fetching task:", error);
      throw error;
    }
  },

  async listTasksByProject(projectId, filters = {}) {
    // filters can include { status, assigneeId, milestoneId, sortBy }
    try {
      const queries = [
        Query.equal("projectId", projectId),
        Query.orderDesc("$createdAt"),
      ]; // Default sort

      if (filters.status) {
        queries.push(Query.equal("status", filters.status));
      }
      if (filters.assigneeId) {
        queries.push(Query.equal("assigneeId", filters.assigneeId));
      }
      if (filters.milestoneId) {
        queries.push(Query.equal("milestoneId", filters.milestoneId));
      }
      if (filters.sortBy) {
        // e.g., 'dueDateAsc', 'priorityDesc'
        if (filters.sortBy === "dueDateAsc")
          queries.push(Query.orderAsc("dueDate"));
        if (filters.sortBy === "dueDateDesc")
          queries.push(Query.orderDesc("dueDate"));
        if (filters.sortBy === "priorityDesc") {
          /* Complex: map priority to number then sort or handle client-side */
        }
      }

      return await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.TASKS_COLLECTION_ID,
        queries
      );
    } catch (error) {
      console.error("Error listing tasks for project:", error);
      throw error;
    }
  },

  async updateTask(taskId, dataToUpdate) {
    try {
      return await databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.TASKS_COLLECTION_ID,
        taskId,
        dataToUpdate
      );
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async deleteTask(taskId) {
    try {
      // First, delete any attachments associated with this task if they exist
      const task = await this.getTask(taskId);
      if (task.attachments && task.attachments.length > 0) {
        for (const fileId of task.attachments) {
          try {
            await storage.deleteFile(
              APPWRITE_CONFIG.TASKS_ATTACHMENTS_BUCKET_ID,
              fileId
            ); // Ensure you have a bucket ID
          } catch (fileError) {
            console.warn(
              `Could not delete attachment ${fileId} for task ${taskId}:`,
              fileError
            );
            // Decide if you want to stop or continue if an attachment fails to delete
          }
        }
      }

      return await databases.deleteDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.TASKS_COLLECTION_ID,
        taskId
      );
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  // --- Attachment Functions ---
  // Note: You need to create a Storage Bucket in Appwrite and get its ID.
  // Add VITE_TASKS_ATTACHMENTS_BUCKET_ID to your .env file.
  // Set appropriate permissions for the bucket (e.g., users with team membership of project can write/read)

  async uploadAttachment(taskId, file) {
    // const bucketId = import.meta.env.VITE_TASKS_ATTACHMENTS_BUCKET_ID;
    // if (!bucketId) {
    //   console.error('Tasks attachment bucket ID is not configured.');
    //   throw new Error('Attachment bucket not configured.');
    // }
    // try {
    //   const response = await storage.createFile(bucketId, ID.unique(), file);
    //   // After successful upload, update the task document with the file ID
    //   const task = await this.getTask(taskId);
    //   const updatedAttachments = [...(task.attachments || []), response.$id];
    //   await this.updateTask(taskId, { attachments: updatedAttachments });
    //   return response;
    // } catch (error) {
    //   console.error('Error uploading attachment:', error);
    //   throw error;
    // }
    console.warn("Attachment upload not fully implemented. Bucket ID needed.");
    return Promise.reject(
      new Error("Attachment upload not fully implemented.")
    );
  },

  async getAttachmentUrl(fileId) {
    // const bucketId = import.meta.env.VITE_TASKS_ATTACHMENTS_BUCKET_ID;
    // try {
    //   // For viewing or downloading. For images, use getFilePreview.
    //   return storage.getFileView(bucketId, fileId);
    // } catch (error) {
    //   console.error('Error getting attachment URL:', error);
    //   throw error;
    // }
    console.warn("Get attachment URL not fully implemented. Bucket ID needed.");
    return Promise.reject(
      new Error("Get attachment URL not fully implemented.")
    );
  },

  async deleteAttachment(taskId, fileId) {
    // const bucketId = import.meta.env.VITE_TASKS_ATTACHMENTS_BUCKET_ID;
    // try {
    //   await storage.deleteFile(bucketId, fileId);
    //   // Update task document to remove the fileId from attachments array
    //   const task = await this.getTask(taskId);
    //   const updatedAttachments = (task.attachments || []).filter(id => id !== fileId);
    //   await this.updateTask(taskId, { attachments: updatedAttachments });
    // } catch (error) {
    //   console.error('Error deleting attachment:', error);
    //   throw error;
    // }
    console.warn("Delete attachment not fully implemented. Bucket ID needed.");
    return Promise.reject(
      new Error("Delete attachment not fully implemented.")
    );
  },

  // --- Comment Functions (Illustrative - requires a 'comments' collection) ---
  // Collection 'comments': content (string), taskId (string), userId (string), createdAt (datetime)
  async addTaskComment(taskId, userId, content) {
    // try {
    //   return await databases.createDocument(
    //     APPWRITE_CONFIG.DATABASE_ID,
    //     'comments', // VITE_COMMENTS_COLLECTION_ID
    //     ID.unique(),
    //     { taskId, userId, content }
    //   );
    // } catch (error) {
    //   console.error('Error adding comment:', error);
    //   throw error;
    // }
    console.warn(
      "Add task comment not fully implemented. Comments collection needed."
    );
    return Promise.reject(new Error("Add task comment not fully implemented."));
  },

  async listTaskComments(taskId) {
    // try {
    //   return await databases.listDocuments(
    //     APPWRITE_CONFIG.DATABASE_ID,
    //     'comments', // VITE_COMMENTS_COLLECTION_ID
    //     [Query.equal('taskId', taskId), Query.orderDesc('$createdAt')]
    //   );
    // } catch (error) {
    //   console.error('Error listing comments:', error);
    //   throw error;
    // }
    console.warn(
      "List task comments not fully implemented. Comments collection needed."
    );
    return Promise.reject(
      new Error("List task comments not fully implemented.")
    );
  },
};
