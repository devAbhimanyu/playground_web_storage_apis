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
    dbInstance.createObjectStore(BOOK_STORE, {
      keyPath: "id",
      autoIncrement: true,
    });
  };

  // dbMain.onerror = (err) => {
  //   console.error("db cannot be initiated", err);
  // };

  dbMain.onsuccess = () => {
    console.log("onSuccess");
    dbOpened = true;
  };

  const fetchAllData = (objectStore: IDBObjectStore) => {
    return new Promise((resolve, reject) => {
      const data = objectStore.getAll();
      data.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
    });
  };

  const addToObjectStore = (
    objectStore: IDBObjectStore,
    data: { [key: string]: string | boolean | number }
  ) => {
    return new Promise((resolve, reject) => {
      const request = objectStore.add(data);
      request.onsuccess = () => {
        resolve("transaction successfull");
      };
      request.onerror = () => {
        reject("the transaction faced an error");
      };
    });
  };

  const addNewItem = async (bookName) => {
    const createdAt = new Date().getTime();

    const dbInstance = dbMain.result;

    // create transaction
    const transactionInstance = dbInstance.transaction(BOOK_STORE, "readwrite");

    const bookStore = transactionInstance.objectStore(BOOK_STORE);

    try {
      const transactionStatus = await addToObjectStore(bookStore, {
        bookName,
        createdAt,
      });
      console.log("test await", transactionStatus);
      const books = await fetchAllData(bookStore);
      console.log("books", books);
    } catch (error) {
      console.error("error", error);
    }
    console.log("test await- 2");
  };

  (window as any).addNewItem = addNewItem;
};
