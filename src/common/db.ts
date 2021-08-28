import SQLite from 'react-native-sqlite-storage'

// SQLite.enablePromise(true)
// SQLite.DEBUG(true)

export default SQLite.openDatabase(
    {
        name: 'tracke',
        location: 'default'
    },
    () => { },
    error => { console.log(error) }
)