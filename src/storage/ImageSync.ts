import { Platform } from "react-native";
import RNFS from "react-native-fs";
import RNFetchBlob, { FetchBlobResponse } from "rn-fetch-blob";
import { database } from "./Database";
import { SyncResponse } from "../types/syncResponse";
import { dirPictures } from "./Images"

export class ImageSync {

  public asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
  public imgURI = (id: string) => {
    return Platform.select({
      ios: `${dirPictures}/${id}`,
      android: `file://${dirPictures}/${id}`
    })
  }

  public syncPhotos = async (email: string, password: string): Promise<any> => {


    let photosToSet = []
    let photosToGet = []

    let devicePhotos = []
    let devicePhotoIds = []

    let metadata = await this.getPhotoMetadata(email, password)
    //TODO send ids from server with no hyphens
    let serverPhotoIds = Object.keys(metadata)


    let patients = await database.getPatients();
    patients.forEach(patient => {
      if (!!patient.image_timestamp) {
        devicePhotoIds.push(patient.id)
        devicePhotos.push({ id: patient.id, imageTimestamp: patient.image_timestamp })
      }
    })

    let photoIdsToGet = serverPhotoIds.filter((id: string) => !devicePhotoIds.includes(id))
    let photoIdsToSet = devicePhotoIds.filter((id: string) => !serverPhotoIds.includes(id))
    let intersection = serverPhotoIds.filter((id: string) => devicePhotoIds.includes(id))

    intersection.forEach(async (id: string) => {
      let serverTimestamp = parseInt(metadata[id].split('.')[0])
      let patient = await database.getPatient(id)
      if (serverTimestamp > parseInt(patient.image_timestamp)) {
        photosToGet.push({ id, imageTimestamp: patient.image_timestamp })
      }

      if (serverTimestamp < parseInt(patient.image_timestamp)) {
        photosToSet.push({ id, imageTimestamp: patient.image_timestamp })
      }
    })

    devicePhotos.forEach(item => {
      if (photoIdsToSet.includes(item.id)) {
        photosToSet.push(item)
      }
    })

    photoIdsToGet.forEach((id: string) => {
      photosToGet.push({ id, imageTimestamp: metadata[id].split('.')[0] })
    })

    //set photos
    photosToSet.forEach(async item => {
      let filename = `${item.imageTimestamp}.jpg`;
      let photoUri = `${dirPictures}/${item.id}/${filename}`
      await this.setPhoto(email, password, item.id, filename, photoUri)
    })

    //get photos
    photosToGet.forEach(async item => {
      let image = await this.getPhoto(email, password, item.id)

      RNFS.mkdir(`${dirPictures}/${item.id}`)
        .then(() => {
          RNFS.writeFile(`${dirPictures}/${item.id}/${item.imageTimestamp}.jpg`, image.data, 'base64')
        })
    })

  }

  private getPhotoMetadata = async (email: string, password: string): Promise<any> => {
    const response = await fetch('https://demo-api.hikmahealth.org/api/photos/metadata', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
        "password": password,
      })
    });
    return await response.json();
  }

  private async getPhoto(
    email: string,
    password: string,
    patientId: string,
  ): Promise<FetchBlobResponse> {
    database.close();
    console.log(
      `Syncing DB!`
    );
    return RNFetchBlob.fetch(
      "POST",
      'https://demo-api.hikmahealth.org/api/photos/get_photo',
      {
        "Content-Type": "application/json",
        Accept: "multipart/form-data"
      }, [
        {
          name: 'email', data: email
        },
        {
          name: 'password', data: password,
        },
        {
          name: 'patient_id', data: patientId
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

  private async setPhoto(
    email: string,
    password: string,
    patientId: string,
    filename: string,
    photoUri: string,
  ): Promise<FetchBlobResponse> {
    database.close();
    console.log(
      `Syncing DB!`
    );
    return RNFetchBlob.fetch(
      "POST",
      'https://demo-api.hikmahealth.org/api/photos/set_photo',
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
          name: 'patient_id', data: patientId
        },
        {
          name: 'photo', filename: filename, data: RNFetchBlob.wrap(photoUri)
        }
      ]
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


  // private getLocalFilePathAndroid(): string {
  //   return (
  //     RNFS.DocumentDirectoryPath + "/../pictures/"
  //   );
  // }

  // private getLocalFilePathIOS(): string {
  //   return (
  //     RNFS.LibraryDirectoryPath + "/pictures"
  //   );
  // }


}
