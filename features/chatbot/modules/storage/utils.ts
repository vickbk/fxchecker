import { UIMessage } from "ai";
import { getDB } from "./db";

export async function getAllMessages() {
  const db = await getDB();

  return new Promise<UIMessage[]>((resolve, reject) => {
    const tx = db
      .transaction("messages", "readonly")
      .objectStore("messages")
      .index("by-createdAt");

    const request = tx.getAll();

    request.onsuccess = () => {
      resolve((request.result as UIMessage[]) || []);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function clearAllMessages() {
  const db = await getDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("messages", "readwrite");
    tx.objectStore("messages").clear();

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function saveMessage(message: UIMessage) {
  const db = await getDB();
  return await new Promise<void>((resolve, reject) => {
    const request = db
      .transaction("messages", "readwrite")
      .objectStore("messages")
      .put({ ...message, createdAt: new Date().getTime() });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function saveAllMessages(messages: UIMessage[]) {
  const messagesMap = new Set<string>();

  const saved = await getAllMessages();
  saved.forEach(({ id }) => messagesMap.add(id));

  await Promise.all(
    messages.map((message) =>
      (async () => {
        try {
          if (messagesMap.has(message.id)) return;

          await saveMessage(message);
        } catch (error) {
          console.log("failed to save message", error);
        }
      })(),
    ),
  );
}
