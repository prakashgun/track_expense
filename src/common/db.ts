import SQLite from 'react-native-sqlite-storage'

// SQLite.enablePromise(true)
// SQLite.DEBUG(true)

const db = SQLite.openDatabase(
    {
        name: 'tracke',
        location: 'default'
    },
    () => { },
    error => { console.log(error) }
)

// Foreign keys are disabled by default in SQLite. So enable it explicitely.
db.executeSql('PRAGMA foreign_keys = ON')

export default db