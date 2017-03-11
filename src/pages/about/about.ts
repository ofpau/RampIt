import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { DetailPage } from '../detail/detail';


import {
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapsLatLng,
 CameraPosition,
 GoogleMapsMarkerOptions,
 GoogleMapsMarker,
 HTTP
} from 'ionic-native';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  map: GoogleMap;
  items: any[];
  serverURL =  "http://46.101.208.141:5000";

  constructor(public navCtrl: NavController) {

    this.items = [{
      lat: 41.3894157,
      lng: 2.1125839,
      title: 'Bar de la FIB',
      imgURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Opera_Garnier_Stairway_2008.JPG/220px-Opera_Garnier_Stairway_2008.JPG",
      description: "Después de la reforma, la planta baja del bar es accesible pero sigue sin haber ascensor para bajar a la zona restaurante."
    },
    {
      lat: 41.387516,
      lng: 2.1112128,
      title: 'Nexus I',
      imgURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Opera_Garnier_Stairway_2008.JPG/220px-Opera_Garnier_Stairway_2008.JPG",
      description: ""

    },
    {
      lat: 41.3894076,
      lng: 2.1359738,
      title: 'Vorera sense rampa',
      imgURL: "http://www.elcalellometre.cat/wp-content/gallery/vorera-carrer-raval-corregida/vorera-carrer-raval1-640-corregida.jpg",
      description: ""
    }
  ];
  }

  // Load map only after view is initialize
  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
     // make sure to create following structure in your view.html file
     // and add a height (for example 100%) to it, else the map won't be visible
     // <ion-content>
     //  <div #map id="map" style="height:100%;"></div>
     // </ion-content>

     // create a new map by passing HTMLElement
     let element: HTMLElement = document.getElementById('map');
     console.log(element);

     this.map = new GoogleMap(element);

     // create LatLng object
     let ionic: GoogleMapsLatLng = new GoogleMapsLatLng(43.0741904,-89.3809802);

     let myCoords = ionic;
     // create CameraPosition
     let position: CameraPosition = {
       target: myCoords,
       zoom: 18,
       tilt: 30
     };

     function setMapCameraToLocation (map: GoogleMap, lat:number, lng: number){
       position = {
         target: new GoogleMapsLatLng(lat, lng),
         zoom: 15,
         tilt: 10
       };
       console.log(lat + ", " + lng);
       map.moveCamera(position);
     }

     // listen to MAP_READY event
     this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
       // move the map's camera to position
       this.map.moveCamera(position); // works on iOS and Android

       this.map.getMyLocation().then((resp) => {
         // resp.coords.latitude
         // resp.coords.longitude
         myCoords = new GoogleMapsLatLng(resp.latLng.lat, resp.latLng.lng);
         setMapCameraToLocation(this.map, resp.latLng.lat, resp.latLng.lng);
         this.loadMarkers(myCoords);

       }).catch((error) => {
         console.log('Error getting location', error);
       });
     });
  }
  recenter() {
    this.map.getMyLocation().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      let newCoord = new GoogleMapsLatLng(resp.latLng.lat, resp.latLng.lng);
      let position = {
        target: newCoord,
        zoom: 15,
        tilt: 10
       };
       this.map.animateCamera(position);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  loadMarkers(coords) {
    HTTP.get(this.serverURL +  "/items", {}, {})
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
  }
  addItemMarker(item) {
    // create new marker
    let markerOptions: GoogleMapsMarkerOptions = {
      position: new GoogleMapsLatLng(item.lat, item.lng),
      title: item.title
    };

    this.map.addMarker(markerOptions)
      .then((marker: GoogleMapsMarker) => {
        //marker.showInfoWindow();
        marker.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe(e => {
          this.pushDetail(item);
          //this.navCtrl.push(DetailPage, {item: 42});
          //let butt = document.getElementById("button");
          //butt.innerText = "pepe";

          //marker.showInfoWindow();
          //let rec = data1.filter(v=>v.title==e.get('title'));
          //alert(rec[0].id);
      })
    })
  }

  pushDetail(item) {
    let lorem = "Earum odio ut unde. Sit a qui consequuntur et corporis quia. Non et laborum similique nobis aut saepe dolorum.";
    if (item.description == "") item.description = lorem;
    this.navCtrl.push(DetailPage, {item: item});
    //alert('title');
  }
}
