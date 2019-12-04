import SQLite from "react-native-sqlite-storage";

export class DatabaseInitialization {
  // Perform any updates to the database schema. These can occur during initial configuration, or after an app store update.
  // This should be called each time the database is opened.
  public updateDatabaseTables(database: SQLite.SQLiteDatabase): Promise<void> {
    let dbVersion: number = 0;
    console.log("Beginning database updates...");

    // First: create tables if they do not already exist
    return database
      .transaction(this.createTables)
      .then(() => {
        // Get the current database version
        return this.getDatabaseVersion(database);
      })
      .then(version => {
        dbVersion = version;
        console.log("Current database version is: " + dbVersion);

        // Perform DB updates based on this version

        // This is included as an example of how you make database schema changes once the app has been shipped
        if (dbVersion < 1) {
          // Uncomment the next line, and the referenced function below, to enable this
          // return database.transaction(this.preVersion1Inserts);
        }
        // otherwise,
        return;
      })
      .then(() => {
        if (dbVersion < 2) {
          // Uncomment the next line, and the referenced function below, to enable this
          // return database.transaction(this.preVersion2Inserts);
        }
        // otherwise,
        return;
      });
  }

  // Perform initial setup of the database tables
  private createTables(transaction: SQLite.Transaction) {
    // DANGER! For dev only
    const dropAllTables = false;
    if (dropAllTables) {
      transaction.executeSql("DROP TABLE IF EXISTS List;");
      transaction.executeSql("DROP TABLE IF EXISTS ListItem;");
      transaction.executeSql("DROP TABLE IF EXISTS Version;");
    }

    // List table
    // DEMO ONLY
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS List( " +
        "list_id INTEGER PRIMARY KEY NOT NULL, " +
        "title TEXT" +
        ");"
    );

    // ListItem table
    //DEMO ONLY
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS ListItem( " +
        "item_id INTEGER PRIMARY KEY NOT NULL, " +
        "list_id INTEGER, " +
        "text TEXT, " +
        "done INTEGER DEFAULT 0, " +
        "FOREIGN KEY ( list_id ) REFERENCES List ( list_id )" +
        ");"
    );

    // Version table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS Version( " +
        "version_id INTEGER PRIMARY KEY NOT NULL, " +
        "version INTEGER" +
        ");"
    );

    // string ids table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS string_ids ( " +
        "id uuid PRIMARY KEY " +
        ");"
    );

    // string content table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS string_content ( " +
        "id uuid REFERENCES string_ids(id) ON DELETE CASCADE, " +
        "language varchar(5), " +
        "content text, " +
        "edited_at timestamp with time zone " +
        ");"
    );

    transaction.executeSql(
      "CREATE UNIQUE INDEX ON string_content (id, language); "
    );

    // Version table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS patients ( " +
        "id uuid PRIMARY KEY, " +
        "given_name uuid REFERENCES string_ids(id) ON DELETE CASCADE," +
        "surname uuid REFERENCES string_ids(id) ON DELETE CASCADE, " +
        "date_of_birth DATE, " +
        "place_of_birth uuid REFERENCES string_ids(id) ON DELETE CASCADE, " +
        "edited_at timestamp with time zone " +
        ");"
    );

    // Clinics table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS clinics ( " +
        "id uuid PRIMARY KEY," +
        "name uuid REFERENCES string_ids(id) ON DELETE CASCADE," +
        "edited_at timestamp with time zone" +
        ");"
    );

    // Users table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS users ( " +
        "id uuid PRIMARY KEY, " +
        "name uuid REFERENCES string_ids(id) ON DELETE CASCADE, " +
        "role text not null, " +
        "email text not null, " +
        "hashed_password text not null, " +
        "edited_at timestamp with time zone " +
        ");"
    );

    // Visits table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS visits ( " +
        "id uuid PRIMARY KEY, " +
        "patient_id uuid REFERENCES patients(id) ON DELETE CASCADE, " +
        "clinic_id uuid REFERENCES clinics(id) ON DELETE CASCADE, " +
        "provider_id uuid REFERENCES users(id) ON DELETE CASCADE, " +
        "check_in_timestamp timestamp with time zone, " +
        "check_out_timestamp timestamp with time zone, " +
        "edited_at timestamp with time zone " +
        ");"
    );

    // Events table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS events ( " +
        "id uuid PRIMARY KEY, " +
        "patient_id uuid REFERENCES patients(id) ON DELETE CASCADE, " +
        "visit_id uuid REFERENCES visits(id) ON DELETE CASCADE, " +
        "event_timestamp timestamp with time zone, " +
        "event_metadata timestamp with time zone " +
        ");"
    );
  }

  // Get the version of the database, as specified in the Version table
  private getDatabaseVersion(database: SQLite.SQLiteDatabase): Promise<number> {
    // Select the highest version number from the version table
    return database
      .executeSql("SELECT version FROM Version ORDER BY version DESC LIMIT 1;")
      .then(([results]) => {
        if (results.rows && results.rows.length > 0) {
          const version = results.rows.item(0).version;
          return version;
        } else {
          return 0;
        }
      })
      .catch(error => {
        console.log(`No version set. Returning 0. Details: ${error}`);
        return 0;
      });
  }

  // Once the app has shipped, use the following functions as a template for updating the database:
  /*
    // This function should be called when the version of the db is < 1
    private preVersion1sInserts(transaction: SQLite.Transaction) {
        console.log("Running pre-version 1 DB inserts");
        // Make schema changes
        transaction.executeSql("ALTER TABLE ...");
        // Lastly, update the database version
        transaction.executeSql("INSERT INTO Version (version) VALUES (1);");
    }
    // This function should be called when the version of the db is < 2
    private preVersion2Inserts(transaction: SQLite.Transaction) {
        console.log("Running pre-version 2 DB inserts");
        
        // Make schema changes
        transaction.executeSql("ALTER TABLE ...");
        // Lastly, update the database version
        transaction.executeSql("INSERT INTO Version (version) VALUES (2);");
    }
    */
}