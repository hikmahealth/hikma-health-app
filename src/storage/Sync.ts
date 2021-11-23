import { Platform, Alert } from "react-native";
import RNFetchBlob, { FetchBlobResponse } from "rn-fetch-blob";
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import RNFS from "react-native-fs";
import { DATABASE } from "./Constants";
import { database } from "./Database";
import { SyncResponse } from "../types/syncResponse";
import { LocalizedStrings } from "../enums/LocalizedStrings";
import NetInfo from "@react-native-community/netinfo"

export class DatabaseSync {

  public async performSync(instanceUrl: string, email: string, password: string, language: string): Promise<any> {
    // const target = this.getCompressionTargetPath()
    const target = Platform.OS === 'ios' ? this.getLocalDBFilePathIOS() : this.getLocalDBFilePathAndroid()

    // this.compressDB(this.getCompressionSourcePath(), target)

    let state = await NetInfo.fetch()
    if (state.isConnected) {
      const response = await this.syncDB(instanceUrl, email, password, target, language)
      const responseData = JSON.parse(response.data);
      responseData.to_execute.forEach(async (element: SyncResponse) => {
        await database.applyScript(element)
      });
      return
    } else {
      Alert.alert(
        LocalizedStrings[language].syncFailure,
        LocalizedStrings[language].syncFailureConnection,
        [
          {
            text: 'OK',
          }
        ]
      )
    }
    return
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
    instanceUrl: string,
    email: string,
    password: string,
    localFilePath: string,
    language: string
  ): Promise<FetchBlobResponse> {
    database.close();
    console.log(
      `Syncing DB!`
    );
    return RNFetchBlob
    .config({ timeout: 600000})
    .fetch(
      "POST",
      `${instanceUrl}/api/sync`,
      {
        "Content-Type": "multipart/form-data",
        "Transfer-Encoding": "chunked"
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
        Alert.alert(
          LocalizedStrings[language].syncSuccess,
          null,
          [
            {
              text: 'OK',
            }
          ],
        )
        return fetchBlobResponse;
        // return responseData;
      } else {
        Alert.alert(
          LocalizedStrings[language].syncFailure,
          LocalizedStrings[language].syncFailureSystem,
          [
            {
              text: 'OK',
            }
          ],
        )
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
