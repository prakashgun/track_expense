module.exports = {
    name: "default",
    type: "react-native",
    database: "trackexp",
    location: "default",
    logging: ["error", "query", "schema"],
    synchronize: false,
    migrationsRun: true,
    entities: ["src/entities/*.ts"]
}