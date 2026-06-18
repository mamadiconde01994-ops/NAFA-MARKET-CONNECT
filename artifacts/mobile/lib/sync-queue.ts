import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SyncTask {
  id: string;
  action: "create" | "update" | "delete";
  entity: string;
  data: any;
  timestamp: number;
  retries: number;
}

const QUEUE_KEY = "nafa_sync_queue";
const MAX_RETRIES = 3;

export class SyncQueue {
  static async add(
    action: "create" | "update" | "delete",
    entity: string,
    data: any
  ): Promise<string> {
    const queue = await this.getQueue();
    const task: SyncTask = {
      id: Date.now().toString(),
      action,
      entity,
      data,
      timestamp: Date.now(),
      retries: 0,
    };
    queue.push(task);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return task.id;
  }

  static async getQueue(): Promise<SyncTask[]> {
    try {
      const json = await AsyncStorage.getItem(QUEUE_KEY);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  }

  static async removeTask(taskId: string): Promise<void> {
    const queue = await this.getQueue();
    const filtered = queue.filter((t) => t.id !== taskId);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
  }

  static async incrementRetry(taskId: string): Promise<void> {
    const queue = await this.getQueue();
    const task = queue.find((t) => t.id === taskId);
    if (task) {
      task.retries += 1;
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    }
  }

  static async clear(): Promise<void> {
    await AsyncStorage.removeItem(QUEUE_KEY);
  }

  static async getPendingCount(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  }

  static async getFailedTasks(): Promise<SyncTask[]> {
    const queue = await this.getQueue();
    return queue.filter((t) => t.retries >= MAX_RETRIES);
  }

  static async retryFailedTasks(): Promise<void> {
    const queue = await this.getQueue();
    const updated = queue.map((t) => ({
      ...t,
      retries: 0,
    }));
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
  }
}
