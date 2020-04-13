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

  public saveImage = async (patientId: string, filePath: string, timestamp: string) => {
    try {
      const newImageName = `${patientId}/${timestamp}.jpg`;
      const newFilepath = `${dirPictures}/${newImageName}`;
      const imageMoved = await this.moveAttachment(patientId, filePath, newFilepath);

      console.log('image moved', imageMoved);
      return newFilepath
    } catch (error) {
      console.log(error);
    }
  };

  public moveAttachment = async (patientId, filePath, newFilepath) => {
    return new Promise((resolve, reject) => {
      RNFS.mkdir(`${dirPictures}/${patientId}`)
        .then(() => {
          RNFS.moveFile(filePath, newFilepath)
            .then(() => {
              console.log('FILE MOVED', filePath, newFilepath);
              resolve(true);
            })
            .catch(error => {
              console.log('moveFile error', error);
              reject(error);
            });
        })
        .catch(err => {
          console.log('mkdir error', err);
          reject(err);
        });
    });
  };

  public syncPhotos = async (instanceUrl: string, email: string, password: string): Promise<any> => {
    let photosToSet = []
    let photosToGet = []

    let devicePhotos = []
    let devicePhotoIds = []
    let devicePatientIds = []

    let metadata = await this.getPhotoMetadata(instanceUrl, email, password)
    let serverPhotoIds = Object.keys(metadata)

    let patients = await database.getPatients();
    patients.forEach(patient => {
      devicePatientIds.push(patient.id)
      if (!!patient.image_timestamp) {
        devicePhotoIds.push(patient.id)
        devicePhotos.push({ id: patient.id, imageTimestamp: patient.image_timestamp })
      }
    })

    let photoIdsToGet = serverPhotoIds.filter((id: string) => ( !devicePhotoIds.includes(id) && devicePatientIds.includes(id)))
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
    await this.asyncForEach(photosToSet, async item => {
      let filename = `${item.imageTimestamp}.jpg`;
      let photoUri = `${dirPictures}/${item.id}/${filename}`
      await this.setPhoto(instanceUrl, email, password, item.id, filename, photoUri)
    })

    //get photos
    await this.asyncForEach(photosToGet, async item => {
      await database.updatePatientImageTimestamp(item.id, item.imageTimestamp)
      let image = await this.getPhoto(instanceUrl, email, password, item.id)

      RNFS.mkdir(`${dirPictures}/${item.id}`)
        .then(() => {
          RNFS.writeFile(`${this.imgURI(item.id)}/${item.imageTimestamp}.jpg`, image.data, 'base64')
        })
    })
  }

  private getPhotoMetadata = async (instanceUrl: string, email: string, password: string): Promise<any> => {
    const response = await fetch(`${instanceUrl}/api/photos/metadata`, {
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
    instanceUrl: string,
    email: string,
    password: string,
    patientId: string,
  ): Promise<FetchBlobResponse> {
    console.log(
      `Getting Photo!`
    );
    return RNFetchBlob.fetch(
      "POST",
      `${instanceUrl}/api/photos/get_photo`,
      {
        "Content-Type": "application/json",
      }, JSON.stringify(
        {
          'email': email,
          'password': password,
          'patient_id': patientId
        })
    ).then(fetchBlobResponse => {
      console.log("Get Photo response: ", fetchBlobResponse);
      if (
        fetchBlobResponse.data &&
        fetchBlobResponse.respInfo &&
        fetchBlobResponse.respInfo.status === 200
      ) {
        console.log("Get Photo SUCCESS!");
        return fetchBlobResponse;
      } else {
        throw new Error(
          "Get Photo failure! HTTP status: " +
          fetchBlobResponse.respInfo.status
        );
      }
    });
  }

  private async setPhoto(
    instanceUrl: string,
    email: string,
    password: string,
    patientId: string,
    filename: string,
    photoUri: string,
  ): Promise<FetchBlobResponse> {
    console.log(
      `Setting Photo!`
    );
    return RNFetchBlob.fetch(
      "POST",
      `${instanceUrl}/api/photos/set_photo`,
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
      console.log("Set Photo response: ", fetchBlobResponse);
      if (
        fetchBlobResponse.data &&
        fetchBlobResponse.respInfo &&
        fetchBlobResponse.respInfo.status === 200
      ) {
        console.log("Set Photo SUCCESS!");
        // const responseData = JSON.parse(fetchBlobResponse.data);
        return fetchBlobResponse;
        // return responseData;
      } else {
        throw new Error(
          "Set Photo failure! HTTP status: " +
          fetchBlobResponse.respInfo.status
        );
      }
    });
  }
}
