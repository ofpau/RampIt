import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {
  Camera,
  Geolocation,
  HTTP
} from 'ionic-native';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  locationString: string;
  serverURL =  "http://46.101.208.141:5000";

  constructor(public navCtrl: NavController) {
    this.locationString = "Esperando localización...";

    Geolocation.getCurrentPosition().then((resp) => {
     // resp.coords.latitude
     // resp.coords.longitude
     this.locationString = resp.coords.latitude + ", " + resp.coords.longitude;
  }).catch((error) => {
    console.log('Error getting location', error);
  });

  }

  submit() {
/*    HTTP.post(this.serverURL +  "/submit", {

    }, {})
        .then(data => {
          let j = JSON.parse(data.data);
          this.items = j;
          for (let i = 0; i < this.items.length; ++i) {
            let item = this.items[i];
            this.addItemMarker(item);
          }
          // data.status, data.data, data.headers
      })
        .catch(error => {
          // error.status, error.error, error.headers
          alert('error.status');
    });
    */
  }
  takePhoto() {
    let options = {
      allowEdit: false
    }

    Camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });
  }

}
