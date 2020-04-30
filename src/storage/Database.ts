import SQLite from "react-native-sqlite-storage";
import { DatabaseInitialization } from "./DatabaseInitialization";
import { Clinic } from "../types/Clinic";
import { User, NewUser } from "../types/User";
import { StringContent } from "../types/StringContent";
import { uuid } from 'uuidv4';
import { SyncResponse } from "../types/syncResponse";
import { Patient, NewPatient } from "../types/Patient";
import { LanguageString } from "../types/LanguageString";
import { Event } from "../types/Event";
import { Visit } from "../types/Visit";

export interface Database {
  open(): Promise<SQLite.SQLiteDatabase>;
  close(): Promise<void>;
  login(email: string, password: string): Promise<any>;
  getClinics(): Promise<Clinic[]>;
  getPatients(): Promise<Patient[]>;
  getPatient(patient_id: string): Promise<Patient>;
  addUser(user: NewUser, password: string): Promise<void>;
  editStringContent(stringContent: StringContent[], id: string): Promise<string>;
  saveStringContent(stringContent: StringContent[], id?: string, addLanguage?: boolean): Promise<string>;
  applyScript(script: SyncResponse): Promise<void>;
  addPatient(patient: NewPatient): Promise<void>;
  editPatient(patient: NewPatient): Promise<Patient>;
  updatePatientImageTimestamp(patientId: string, newTimestamp: string): Promise<void>;
  getLatestPatientEventByType(patient_id: string, event_type: string): Promise<string>;
  addEvent(event: Event): Promise<void>;
  addVisit(visit: Visit): Promise<void>;
  getUser(user_id: string): Promise<User>;
  getVisits(patient_id: string): Promise<Visit[]>;
  getEvents(visit_id: string): Promise<Event[]>;
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

  public async saveStringContent(stringContent: StringContent[], id?: string, addLanguage?: boolean): Promise<string> {
    const contentId = id || uuid();
    var stringId = contentId.replace(/-/g, "");
    const idExists = await this.getIdExists(stringId)
    const db = await this.getDatabase();
    if (!addLanguage && !idExists) {
      await db.executeSql(`INSERT INTO string_ids (id) VALUES (?);`, [stringId]);
    }
    if (idExists) {
      stringContent.forEach(async element => {
        await this.updateStringWithId(element, stringId);
      })
    } else {
      stringContent.forEach(async element => {
        await this.saveStringWithId(element, stringId);
      })
    }

    return stringId;
  }

  public async editStringContent(stringContent: StringContent[], id: string): Promise<string> {
    const db = await this.getDatabase();
    stringContent.forEach(async element => {
      await this.editStringWithId(element, id);
    })
    return id;
  }

  private async editStringWithId(stringContent: StringContent, id: string): Promise<string> {
    const date = new Date().toISOString();
    const db = await this.getDatabase();
    await db.executeSql(`UPDATE string_content SET content = ?, edited_at = ? WHERE id = ? AND language = ?`, [stringContent.content, date, id, stringContent.language]);
    return id;
  }

  private async getIdExists(id: string): Promise<boolean> {
    return this.getDatabase()
      .then(db =>
        db.executeSql("SELECT * FROM string_ids WHERE ID = ?", [id])
      )
      .then(async ([results]) => {
        return !(results === undefined || results.rows.length < 1)
      });
  }

  private async saveStringWithId(stringContent: StringContent, id: string): Promise<string> {
    const date = new Date().toISOString();
    const db = await this.getDatabase();
    await db.executeSql(`INSERT INTO string_content (id, language, content, edited_at) VALUES (?, ?, ?, ?);`, [id, stringContent.language, stringContent.content, date]);
    return id;
  }

  private async updateStringWithId(stringContent: StringContent, id: string): Promise<string> {
    const date = new Date().toISOString();
    const db = await this.getDatabase();
    await db.executeSql(`UPDATE string_content SET language = ?, content = ?, edited_at = ? WHERE ID = ?;`, [stringContent.language, stringContent.content, date, id]);
    return id;
  }

  public async addUser(user: NewUser, password: string): Promise<void> {
    const date = new Date().toISOString();
    const id = user.id.replace(/-/g, "");
    // const hashed_password = bcrypt.hash(password, 10, function (err, hash) {
    //   return hash
    // });
    const hashed_password = password
    const db = await this.getDatabase();

    await db.executeSql(`INSERT INTO users (id, name, role, email, hashed_password, edited_at) VALUES (?, ?, ?, ?, ?, ?);`, [id, user.name, user.role, user.email, hashed_password, date]);
    return;
  }

  public addPatient(patient: NewPatient): Promise<void> {
    const date = new Date().toISOString();
    const id = patient.id.replace(/-/g, "")
    return this.getDatabase()
      .then(db =>
        db.executeSql(`INSERT INTO patients (id, given_name, surname, date_of_birth, country, hometown, phone, sex, image_timestamp, edited_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [id, patient.given_name, patient.surname, patient.date_of_birth, patient.country, patient.hometown, patient.phone, patient.sex, patient.image_timestamp, date])
      )
      .then(([results]) => {
        console.log(
          `[db] Added patient with id: "${id}"!`
        );
      });
  }

  public editPatient(patient: NewPatient): Promise<Patient> {
    const date = new Date().toISOString();
    return this.getDatabase()
      .then(db =>
        db.executeSql(`UPDATE patients SET given_name = ?, surname = ?, date_of_birth = ?, country = ?, hometown = ?, phone = ?, sex = ?, image_timestamp = ?, edited_at = ? WHERE id = ?`, [patient.given_name, patient.surname, patient.date_of_birth, patient.country, patient.hometown, patient.phone, patient.sex, patient.image_timestamp, date, patient.id])
      )
      .then(async ([results]) => {

        return this.getPatient(patient.id)

      });
  }

  public updatePatientImageTimestamp(patientId: string, newTimestamp: string): Promise<void> {
    const date = new Date().toISOString();
    return this.getDatabase()
      .then(db =>
        db.executeSql(`UPDATE patients SET image_timestamp = ?, edited_at = ? WHERE id = ?`, [newTimestamp, date, patientId])
      ).then(() => {
        return
      })
  }

  public addEvent(event: Event): Promise<void> {
    const date = new Date().toISOString();
    const id = event.id.replace(/-/g, "")
    return this.getDatabase()
      .then(db =>
        db.executeSql(`INSERT INTO events (id, patient_id, visit_id, event_type, event_timestamp, edited_at, event_metadata) VALUES (?, ?, ?, ?, ?, ?, ?);`, [id, event.patient_id, event.visit_id, event.event_type, date, date, event.event_metadata])
      )
      .then(([results]) => {
        console.log(
          `[db] Added event with id: "${id}"!`
        );
      });
  }

  public addVisit(visit: Visit): Promise<void> {
    const date = new Date().toISOString();
    const id = visit.id.replace(/-/g, "")
    return this.getDatabase()
      .then(db =>
        db.executeSql(`INSERT INTO visits (id, patient_id, clinic_id, provider_id, check_in_timestamp, edited_at) VALUES (?, ?, ?, ?, ?, ?);`, [id, visit.patient_id, visit.clinic_id, visit.provider_id, date, date])
      )
      .then(([results]) => {
        console.log(
          `[db] Added visit with id: "${id}"!`
        );
      });
  }

  public getLatestPatientEventByType(patient_id: string, event_type: string): Promise<string> {
    return this.getDatabase()
      .then(db =>
        db.executeSql("SELECT event_metadata FROM events WHERE patient_id = ? AND event_type = ? ORDER BY event_timestamp DESC LIMIT 1;", [patient_id, event_type])
      )
      .then(async ([results]) => {
        if (results === undefined || results.rows.length < 1) {
          return '';
        }
        const row = results.rows.item(0);
        const { event_metadata } = row;
        console.log(
          `[db] Retrieved event for patient with id: "${patient_id}"!`
        );
        return event_metadata;
      });
  }

  // gets clinics from database
  public async getClinics(): Promise<Clinic[]> {
    console.log("[db] Fetching clinics from the db...");
    return this.getDatabase()
      .then(db =>
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

  public getPatients(): Promise<Patient[]> {
    console.log("[db] Fetching patients from the db...");
    return this.getDatabase()
      .then(db =>
        db.executeSql("SELECT id, given_name, surname, date_of_birth, country, hometown, sex, phone, image_timestamp FROM patients;")
      )
      .then(async ([results]) => {
        if (results === undefined) {
          return [];
        }
        const count = results.rows.length;
        const patients: Patient[] = [];
        for (let i = 0; i < count; i++) {

          const row = results.rows.item(i);
          const { id, given_name, surname, date_of_birth, country, hometown, sex, phone, image_timestamp } = row;
          const givenNameContent = await this.languageStringDataById(given_name)
          const surnameContent = await this.languageStringDataById(surname)
          const countryContent = await this.languageStringDataById(country)
          const hometownContent = await this.languageStringDataById(hometown)
          console.log(`[db] Patient name: ${given_name}, id: ${id}`);
          patients.push({ id, given_name: givenNameContent, surname: surnameContent, date_of_birth, country: countryContent, hometown: hometownContent, sex, phone, image_timestamp });
        }
        return patients;
      });
  }

  public login(email: string, password: string): Promise<any> {
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

  //TODO: find by selected language
  private async languageStringDataById(id: string): Promise<LanguageString> {
    return this.getDatabase()
      .then(db =>
        db.executeSql(
          `SELECT language as language_string, content as content_string FROM string_content WHERE id = ?;`,
          [id]
        )
      )
      .then(([results]) => {
        if (results === undefined) {
          return null;
        }
        const count = results.rows.length;
        const content = {}

        for (let i = 0; i < count; i++) {
          const row = results.rows.item(i);
          const { language_string, content_string } = row;
          content[language_string] = content_string;
        }
        if (count > 0) {
          return { id, content }
        }
        return null
      });
  }

  public getPatient(patient_id: string): Promise<Patient> {
    console.log("[db] Fetching patients from the db...");
    return this.getDatabase()
      .then(db =>
        db.executeSql("SELECT id, given_name, surname, date_of_birth, country, hometown, sex, phone, image_timestamp FROM patients WHERE id = ?;", [patient_id])
      )
      .then(async ([results]) => {
        if (results === undefined) {
          return;
        }
        const row = results.rows.item(0);
        const { id, given_name, surname, date_of_birth, country, hometown, sex, image_timestamp, phone } = row;
        const givenNameContent = await this.languageStringDataById(given_name)
        const surnameContent = await this.languageStringDataById(surname)
        const countryContent = await this.languageStringDataById(country)
        const hometownContent = await this.languageStringDataById(hometown)

        const editedPatient: Patient = { id, given_name: givenNameContent, surname: surnameContent, date_of_birth, country: countryContent, hometown: hometownContent, sex, phone, image_timestamp };
        console.log(
          `[db] Edited patient with id: "${id}"!`
        );
        return editedPatient;
      });
  }

  public getUser(user_id: string): Promise<User> {
    console.log("[db] Fetching user from the db...");
    return this.getDatabase()
      .then(db =>
        db.executeSql("SELECT id, name, role, email FROM users WHERE id = ?;", [user_id])
      )
      .then(async ([results]) => {
        if (results === undefined) {
          return;
        }
        const row = results.rows.item(0);
        const { id, name, role, email } = row;
        const nameContent = await this.languageStringDataById(name)

        const user: User = { id, name: nameContent, role, email };
        console.log(
          `[db] Retrieved user with id: "${id}"!`
        );
        return user;
      });
  }

  public getVisits(patient_id: string): Promise<Visit[]> {
    return this.getDatabase()
      .then(db =>
        db.executeSql("SELECT v.id, v.patient_id, v.clinic_id, v.provider_id, v.check_in_timestamp, u.name FROM visits as v INNER JOIN users as u ON v.provider_id=u.id WHERE patient_id = ? ORDER BY check_in_timestamp DESC;", [patient_id])
      )
      .then(async ([results]) => {
        if (results === undefined) {
          return [];
        }
        const count = results.rows.length;
        const visits: Visit[] = [];
        for (let i = 0; i < count; i++) {
          const row = results.rows.item(i);
          const { id, patient_id, clinic_id, provider_id, check_in_timestamp, name } = row;
          const nameContent = await this.languageStringDataById(name)

          visits.push({ id, patient_id, clinic_id, provider_id, check_in_timestamp, provider_name: nameContent });
        }
        return visits;
      });
  }

  public getEvents(visit_id: string): Promise<Event[]> {
    return this.getDatabase()
      .then(db =>
        db.executeSql("SELECT id, patient_id, event_type, event_metadata FROM events WHERE visit_id = ? GROUP BY event_type ORDER BY event_timestamp DESC;", [visit_id])
      )
      .then(([results]) => {
        if (results === undefined) {
          return [];
        }
        const count = results.rows.length;
        const events: Event[] = [];
        for (let i = 0; i < count; i++) {
          const row = results.rows.item(i);
          const { id, patient_id, event_type, event_metadata } = row;

          events.push({ id, patient_id, event_type, event_metadata });
        }
        return events;
      });
  }

  public async applyScript(syncResponse: SyncResponse): Promise<void> {

    return this.getDatabase().then(db => {
      db.transaction((transaction: SQLite.Transaction) => {
        syncResponse.values.forEach(value => {
          transaction.executeSql(syncResponse.sql, value)
        })
      })
    }).then(() => {
      console.log(
        `[db] Updates applied!`
      );
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