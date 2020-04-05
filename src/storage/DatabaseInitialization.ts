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
      transaction.executeSql("DROP TABLE IF EXISTS version;");
      transaction.executeSql("DROP TABLE IF EXISTS string_ids;");
      transaction.executeSql("DROP TABLE IF EXISTS string_content;");
      transaction.executeSql("DROP TABLE IF EXISTS patients;");
      transaction.executeSql("DROP TABLE IF EXISTS clinics;");
      transaction.executeSql("DROP TABLE IF EXISTS users;");
      transaction.executeSql("DROP TABLE IF EXISTS visits;");
      transaction.executeSql("DROP TABLE IF EXISTS events;");
    }

    // Version table
    transaction.executeSql(
        "CREATE TABLE IF NOT EXISTS version( " +
        "version_id INTEGER PRIMARY KEY NOT NULL, " +
        "version INTEGER" +
        ");"
    );

    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS string_ids (id varchar(32) PRIMARY KEY);"
    );

    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS string_content (id varchar(32) REFERENCES string_ids(id) ON DELETE CASCADE, language varchar(5), content text, edited_at text);"
    );

    transaction.executeSql(
      "CREATE UNIQUE INDEX IF NOT EXISTS string_content_id_language_udx ON string_content (id, language);"
    );

    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS patients (id varchar(32) PRIMARY KEY, given_name varchar(32) REFERENCES string_ids(id) ON DELETE CASCADE, surname varchar(32) REFERENCES string_ids(id) ON DELETE CASCADE, date_of_birth varchar(10), country varchar(32) REFERENCES string_ids(id), hometown varchar(32) REFERENCES string_ids(id) ON DELETE CASCADE, phone text, sex varchar(1), image_timestamp text, edited_at text);"
    );

    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS clinics (id varchar(32) PRIMARY KEY, name varchar(32) REFERENCES string_ids(id) ON DELETE CASCADE, edited_at text);"
    );

    // Version table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS users (id varchar(32) PRIMARY KEY, name varchar(32) REFERENCES string_ids(id) ON DELETE CASCADE, role text not null, email text not null, hashed_password text not null, edited_at text);"
    );

    // Clinics table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS visits (id varchar(32) PRIMARY KEY, patient_id varchar(32) REFERENCES patients(id) ON DELETE CASCADE, clinic_id varchar(32) REFERENCES clinics(id) ON DELETE CASCADE, provider_id varchar(32) REFERENCES users(id) ON DELETE CASCADE, check_in_timestamp text, edited_at text);"
    );

    // Users table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS events (id varchar(32) PRIMARY KEY, patient_id varchar(32) REFERENCES patients(id) ON DELETE CASCADE, visit_id varchar(32) REFERENCES visits(id) ON DELETE CASCADE, event_type text, event_timestamp text, edited_at text, event_metadata text);"
    );
  }

  // Get the version of the database, as specified in the Version table
  private getDatabaseVersion(database: SQLite.SQLiteDatabase): Promise<number> {
    // Select the highest version number from the version table
    return database
      .executeSql("SELECT version FROM version ORDER BY version DESC LIMIT 1;")
      .then(([results]) => {
        if (results.rows && results.rows.length > 0) {
          return results.rows.item(0).version;
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