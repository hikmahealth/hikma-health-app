import { Platform } from "react-native";
import RNFS from "react-native-fs";
import RNFetchBlob, { FetchBlobResponse } from "rn-fetch-blob";
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import { DATABASE } from "../database/Constants";
import { database } from "../database/Database";
import { SyncResponse } from "../types/syncResponse";


export class DatabaseSync {

  // private url = 'https://demo-api.hikmahealth.org/api/sync';
  private url = 'http://216.21.162.104:42069/api/sync';

  public async performSync(email: string, password: string): Promise<any> {
    // const target = this.getCompressionTargetPath()
    const target = Platform.OS === 'ios' ? this.getLocalDBFilePathIOS() : this.getLocalDBFilePathAndroid()

    // this.compressDB(this.getCompressionSourcePath(), target)

    try {
      const response = await this.syncDB(email, password, target)
      const responseData = JSON.parse(response.data);
      responseData.to_execute.forEach(async (element: SyncResponse) => {
        await database.applyScript(element)
      });
    }
    catch (error) {
      console.error("Database sync error!", error);
    };
  }

  private compressDB(
    sourcePath: string,
    targetPath: string
  ): Promise<void> {
    return zip(sourcePath, targetPath)
      .then((compressedPath) => {
        console.log(`zip completed at ${compressedPath}`)
      })
      .catch((error) => {
        console.log(error)
      })

  }

  private async syncDB(
    email: string,
    password: string,
    localFilePath: string,
  ): Promise<FetchBlobResponse> {
    database.close();
    console.log(
      `Syncing DB!`
    );
    return RNFetchBlob.fetch(
      "POST",
      this.url,
      {
        "Content-Type": "multipart/form-data",
      }, [
        {
          name: 'email', data: email
        },
        {
          name: 'password', data: password,
        },
        {
          name: 'db', filename: 'AppDatabase.db', data: RNFetchBlob.wrap(localFilePath)
        }
      ]

      // RNFetchBlob.wrap(localFilePath)
    ).then(fetchBlobResponse => {
      console.log("Sync response: ", fetchBlobResponse);
      if (
        fetchBlobResponse.data &&
        fetchBlobResponse.respInfo &&
        fetchBlobResponse.respInfo.status === 200
      ) {
        console.log("Sync SUCCESS!");
        // const responseData = JSON.parse(fetchBlobResponse.data);
        return fetchBlobResponse;
        // return responseData;
      } else {
        throw new Error(
          "Sync failure! HTTP status: " +
          fetchBlobResponse.respInfo.status
        );
      }
    });
  }

  private getDatabaseName(): string {
    return DATABASE.FILE_NAME;
  }

  private getTargetPathName(): string {
    return DATABASE.COMPRESSED_FILE_NAME;
  }

  private getLocalDBFilePathAndroid(): string {
    return (
      RNFS.DocumentDirectoryPath + "/../databases/" + this.getDatabaseName()
    );
  }

  private getLocalDBFilePathIOS(): string {
    return (
      RNFS.LibraryDirectoryPath + "/LocalDatabase/" + this.getDatabaseName()
    );
  }

  private getCompressionSourcePath(): string {
    return (
      RNFS.DocumentDirectoryPath + "/databases/"
    );
  }

  private getCompressionTargetPath(): string {
    return (
      RNFS.DocumentDirectoryPath + "/databases/" + this.getTargetPathName()
    );
  }
}
