import RNFS from "react-native-fs";
import RNFetchBlob, { FetchBlobResponse } from "rn-fetch-blob";
import { DATABASE } from "../database/Constants";

export class DatabaseSync {

  private url = 'https://demo-api.hikmahealth.org/api/login';

  performSync(): Promise<any> {

    return this.syncDB(
      this.getLocalDBFilePath()
    ).catch(error => {
        console.error("Database sync error!", error);
      });
  }

  private syncDB(
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

  private getLocalDBFilePath(): string {
    return (
      RNFS.LibraryDirectoryPath + "/LocalDatabase/" + this.getDatabaseName()
    );
  }

}
