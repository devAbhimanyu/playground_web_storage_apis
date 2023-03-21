window.onload = () => {
  console.log("files has loaded");

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

  dbMain.onsuccess = (event) => {
    console.log("onSuccess");
    const dbInstance = (event as any).target.result as IDBDatabase;

    /**
     * creating transaction
     * first we need to open object store
     * modes = "readonly" | "readwrite" | "versionchange"
     */

    const transactionInstance = dbInstance.transaction(BOOK_STORE, "readwrite");

    /**
     * get the obectt store
     */

    const bookStore = transactionInstance.objectStore(BOOK_STORE);

    bookStore.add({ id: 1, name: "test" });

    console.log("bookStore", bookStore);
  };
};
