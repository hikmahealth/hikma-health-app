import RNFS from "react-native-fs";
import RNFetchBlob, { FetchBlobResponse } from "rn-fetch-blob";
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import { DATABASE } from "../database/Constants";

export default class DatabaseSync {

  private url = 'https://demo-api.hikmahealth.org/api/login';

  public performSync(email: string, password: string): Promise<any> {
    // const target = this.getCompressionTargetPath()
    const target = this.getLocalDBFilePath()

    // this.compressDB(this.getCompressionSourcePath(), target)

    return this.syncDB(email, password, target).catch(error => {
        console.error("Database sync error!", error);
      });
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

  private syncDB(
    email: string,
    password: string,
    localFilePath: string,
  ): Promise<FetchBlobResponse> {
    console.log(
      `Syncing DB!`
    );
    return RNFetchBlob.fetch(
      "POST",
      this.url,
      {
        "Content-Type": "application/octet-stream",
      },
      RNFetchBlob.wrap(localFilePath)
    ).then(fetchBlobResponse => {
      console.log("Sync response: ", fetchBlobResponse);
      if (
        fetchBlobResponse.data &&
        fetchBlobResponse.respInfo &&
        fetchBlobResponse.respInfo.status === 200
      ) {
        console.log("Sync SUCCESS!");
        const responseData = JSON.parse(fetchBlobResponse.data);
        return responseData;
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

  private getLocalDBFilePath(): string {
    return (
      RNFS.DocumentDirectoryPath + "/databases/" + this.getDatabaseName()
    );
  }

  private getCompressionSourcePath(): string {
    return (
      RNFS.ExternalStorageDirectoryPath + "/databases/"
      // "Library/LocalDatabase/"
    );
  }

  private getCompressionTargetPath(): string {
    return (
      RNFS.ExternalStorageDirectoryPath + "/databases/" + this.getTargetPathName()
      // "Library/LocalDatabase/"
    );
  }
}
