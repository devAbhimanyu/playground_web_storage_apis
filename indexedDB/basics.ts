window.onload = () => {
  console.log("files has loaded");

  const DB_NAME = "test-db";
  // db versions are always needed to be integers, as decimals will be converted back to
  const DB_VERSION = 1;

  const dbMain = indexedDB.open(DB_NAME, DB_VERSION);

  dbMain.onupgradeneeded = (event) => {
    console.log("onupgradeneeded", event);
  };

  dbMain.onerror = (err) => {
    console.error("db cannot be initiated", err);
  };

  dbMain.onsuccess = (event) => {
    console.log("onSuccess", event.target);
  };

  dbMain.onblocked = (event) => {
    console.log("db is blocked", event);
  };
};
