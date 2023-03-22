window.onload = () => {
  let dbOpened = false;

  const DB_NAME = "test-db";
  // db versions are always needed to be integers, as decimals will be converted back to
  const DB_VERSION = 1;

  const BOOK_STORE = "books";

  const dbMain = indexedDB.open(DB_NAME, DB_VERSION);

  dbMain.onupgradeneeded = (event) => {
    console.log("onupgradeneeded", event);
    const dbInstance = event.target.result;

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

  dbMain.onsuccess = (objectStore, id) => {
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
        alert("fetchAllData");
        reject("fetchAllData", error);
      };
    });
  };

  const addToObjectStore = (objectStore, data) => {
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
      console.log("error", error);
    }
    console.log("test await- 2");
    dbInstance.close();
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
  window.addNewItem = addNewItem;
  window.getItem = getItem;
};
