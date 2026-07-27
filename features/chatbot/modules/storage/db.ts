const DB_NAME = "finbot_chat_db";
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

export function getDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Failed to open IndexedDB: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("messages")) {
        const store = db.createObjectStore("messages", { keyPath: "id" });
        store.createIndex("by-createdAt", "createdAt");
      }
    };
  });
}

export function closeDB() {
  dbInstance?.close();
  dbInstance = null;
}
