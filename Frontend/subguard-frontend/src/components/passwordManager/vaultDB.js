const DB_NAME = "subguard_vault_db";
const STORE_NAME = "passwords";

export function openDB() {
  return new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(request.error);
  });
}

export async function saveEntry(entry, userId) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  
  // Attach userId for multi-user isolation on same browser
  store.put({ ...entry, userId: String(userId) });
  
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getEntries(userId) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve) => {
    const request = store.getAll();
    request.onsuccess = () => {
      // Filter entries relevant to current logged-in user
      const filtered = request.result.filter(entry => entry.userId === String(userId));
      resolve(filtered);
    };
  });
}

export async function deleteEntry(id) {

  const db = await openDB();

  const tx = db.transaction(STORE_NAME, "readwrite");

  const store = tx.objectStore(STORE_NAME);

  store.delete(id);
}