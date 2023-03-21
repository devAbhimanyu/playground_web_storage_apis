window.onload = () => {
  console.log("files has loaded");

  const DB_NAME = "test-db";
  // db versions are always needed to be integers, as decimals will be converted back to
  const DB_VERSION = 1;

  const dbMain = indexedDB.open(DB_NAME, DB_VERSION);

  dbMain.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    console.log("onupgradeneeded", event);
    const dbInstance = (event as any).target.result as IDBDatabase;
    /**
     * creating object store instances
     * createObjectStore(storeName, options)
     */
    dbInstance.createObjectStore("books", { autoIncrement: true });

    /**
     * keyPath acts as the primary key
     */
    dbInstance.createObjectStore("authors", {
      keyPath: "name",
      autoIncrement: false,
    });
  };

  // dbMain.onerror = (err) => {
  //   console.error("db cannot be initiated", err);
  // };

  // dbMain.onsuccess = (event) => {
  //   console.log("onSuccess", event.target);
  // };
};
