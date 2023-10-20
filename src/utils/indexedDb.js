let db;

export function createDatabase() {



    const request = window.indexedDB.open('BirdFarm', 2);

// Event handling
    request.onerror = (e) => {
        console.error(`IndexedDB error: ${request.errorCode}`);
    };

    request.onsuccess = (e) => {
        console.info('Successful database connection');
        db = request.result;
        const objectStore = db.createObjectStore('student', {keyPath: 'email'});

        // Indexes
        objectStore.createIndex('email', 'email', { unique: true });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('lastname', 'lastname', { unique: false });
        objectStore.createIndex('age', 'age', { unique: false });
    
        // Transaction completed
        objectStore.transaction.oncompleted = (e)=> {
            console.log('Object store "student" created');
        }
    };

    request.onupgradeneeded = (e) => {
        console.info('Database created');
        const db = request.result;
    };

}