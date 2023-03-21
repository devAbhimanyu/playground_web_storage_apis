window.onload = () => {
  let dbOpened = false;

  const DB_NAME = "test-db";
  // db versions are always needed to be integers, as decimals will be converted back to
  const DB_VERSION = 1;

  const BOOK_STORE = "books";

  const dbMain = indexedDB.open(DB_NAME, DB_VERSION);

  dbMain.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    console.log("onupgradeneeded", event);
    const dbInstance = (event as any).target.result as IDBDatabase;

    /**
     * creating object store instances
     * createObjectStore(storeName, options)
     */
    dbInstance.createObjectStore(BOOK_STORE, { autoIncrement: true });
  };

  // dbMain.onerror = (err) => {
  //   console.error("db cannot be initiated", err);
  // };

  dbMain.onsuccess = () => {
    console.log("onSuccess");
    dbOpened = true;
  };

  const fetchFromKeyPathId = (objectStore, id) => {
    return new Promise((resolve, reject) => {
      const request = objectStore.get(id);
      request.onsuccess = (event) => {
        const data = event.target.result;
        if (data) {
          resolve(data);
        }
        reject(null);
      };
      request.onerror = (error) => {
        console.log("err", error);
        reject(error);
      };
    });
  };

  const fetchAllData = (objectStore) => {
    return new Promise((resolve, reject) => {
      const data = objectStore.getAll();
      data.onsuccess = (event) => {
        resolve(event.target.result);
      };
      data.orerror = (error) => {
        reject(error);
      };
    });
  };

  const getItem = async (id) => {
    const dbInstance = dbMain.result;

    // create transaction
    const transactionInstance = dbInstance.transaction(BOOK_STORE, "readwrite");

    const bookStore = transactionInstance.objectStore(BOOK_STORE);
    try {
      const data = await fetchFromKeyPathId(bookStore, id);
      console.log("getItem", data);
    } catch (error) {
      console.error("error", error);
    }
    // dbInstance.close();
  };
  (window as any).getItem = getItem;
};
