import SQLite from "react-native-sqlite-storage";
import { DatabaseInitialization } from "./DatabaseInitialization";
import { List } from "../types/List";
import { ListItem } from "../types/ListItem";
import { Clinic } from "../types/Clinic";
import { User } from "../types/User";
import { StringContent } from "../types/StringContent";
import { uuid } from 'uuidv4';
// import * as bcrypt from 'bcrypt';

export interface Database {
  open(): Promise<SQLite.SQLiteDatabase>;
  close(): Promise<void>;
  login(email: string, hashed_password: string): Promise<User>;
  getClinics(): Promise<Clinic[]>;
  createUser(user: User, password: string): Promise<void>;
  languageStringDataById(id: string): Promise<StringContent>;
  saveStringContent(stringContent: StringContent, id?: string): Promise<string>
}

class DatabaseImpl implements Database {
  private databaseName = "AppDatabase.db";
  private database: SQLite.SQLiteDatabase | undefined;

  // Open the connection to the database
  public open(): Promise<SQLite.SQLiteDatabase> {
    SQLite.DEBUG(true);
    SQLite.enablePromise(true);
    let databaseInstance: SQLite.SQLiteDatabase;

    return SQLite.openDatabase({
      name: this.databaseName,
      location: "default"
    })
      .then(db => {
        databaseInstance = db;
        console.log("[db] Database open!");

        // Perform any database initialization or updates, if needed
        const databaseInitialization = new DatabaseInitialization();
        return databaseInitialization.updateDatabaseTables(databaseInstance);
      })
      .then(() => {
        this.database = databaseInstance;
        return databaseInstance;
      });
  }

  // Close the connection to the database
  public close(): Promise<void> {
    if (this.database === undefined) {
      return Promise.reject("[db] Database was not open; unable to close.");
    }
    return this.database.close().then(status => {
      console.log("[db] Database closed.");
      this.database = undefined;
    });
  }

  // Insert a new list into the database
  public createList(newListTitle: string): Promise<void> {
    return this.getDatabase()
      .then(db =>
        db.executeSql("INSERT INTO List (title) VALUES (?);", [newListTitle])
      )
      .then(([results]) => {
        const { insertId } = results;
        console.log(
          `[db] Added list with title: "${newListTitle}"! InsertId: ${insertId}`
        );
      });
  }

  public saveStringContent(stringContent: StringContent, id?: string): Promise<string> {
    const contentId = id || uuid();
    const date = new Date().toISOString();
    var stringId = contentId.replace(/-/g, "");
    return this.getDatabase()
      .then(db =>
        db.executeSql(`INSERT INTO string_ids (id) VALUES (X'${stringId}'); INSERT INTO string_content (id, language, content, edited_at) VALUES (?, ?, ?, ?);`, [stringId, stringContent.language, stringContent.content, date]),
      )
      .then(() => {
        return stringId;
      });
  }

  public createUser(user: User, password: string): Promise<void> {
    // const hashed_password = bcrypt.hash(password, 10, function (err, hash) {
    //   return hash
    // });
    const hashed_password = password
    return this.getDatabase()
      .then(db =>
        db.executeSql(`INSERT INTO users (id, name, role, email, hashed_password) VALUES (X'${user.id.replace(/-/g, "")}', ?, ?, ?, ?);`, [user.name, user.role, user.email, hashed_password])
      )
      .then(([results]) => {
        const { insertId } = results;
        console.log(
          `[db] Added user with name: "${user.name}"!`
        );
      });
  }

  // gets clinics from database
  public getClinics(): Promise<Clinic[]> {
    console.log("[db] Fetching clinics from the db...");
    return this.getDatabase()
      .then(db =>
        // Get all the lists, ordered by newest lists first
        db.executeSql("SELECT * FROM clinics ORDER BY id DESC;")
      )
      .then(([results]) => {
        if (results === undefined) {
          return [];
        }
        const count = results.rows.length;
        const clinics: Clinic[] = [];
        for (let i = 0; i < count; i++) {
          const row = results.rows.item(i);
          const { name, id } = row;
          console.log(`[db] Clinic name: ${name}, id: ${id}`);
          clinics.push({ id, name });
        }
        return clinics;
      });
  }

  public login(email: string, password: string): Promise<User> {
    return this.getDatabase()
      .then(db =>
        db.executeSql(
          `SELECT * FROM users WHERE email = ?;`,
          [email]
        )
      )
      .then(([results]) => {
        if (results === undefined) {
          return null;
        }
        const count = results.rows.length;
        for (let i = 0; i < count; i++) {
          const row = results.rows.item(i);
          // let match = bcrypt.compare(password, row.hashed_password, res => {
          //   return res;
          // });

          let match = (row.hashed_password === password)
          if (match) {
            return row;
          }
        }
      });
  }

  public languageStringDataById(id: string): Promise<StringContent> {
    return this.getDatabase()
      .then(db =>
        db.executeSql(
          `SELECT language, content FROM string_content WHERE id = ?;`,
          [id]
        )
      )
      .then(([results]) => {
        if (results === undefined) {
          return null;
        }
        const count = results.rows.length;
        return (count == 1) ? results.rows.item(0) : null;
      });
  }

  private getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (this.database !== undefined) {
      return Promise.resolve(this.database);
    }
    // otherwise: open the database first
    return this.open();
  }
}

// Export a single instance of DatabaseImpl
export const database: Database = new DatabaseImpl();