import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MouseEvent } from "@agm/core";


@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnChanges {
  @Input() Latitude:string;
  @Input() Longitude: string;
  // google maps zoom level
  zoom: number = 8;
  // initial center position for the map
  lat: number = parseFloat('18.520430');
  lng: number = parseFloat('73.856744');
  ngOnChanges(changes: SimpleChanges) {
    if (changes.Latitude && this.Latitude) {
      this.lat = parseFloat(this.Latitude);
    }
    if (changes.Longitude && this.Longitude) {
      this.lng = parseFloat(this.Longitude);
    }
  }

  clickedMarker(label: string, index: number) {
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
  }

  markers: marker[] = [
    {
      lat: 51.673858,
      lng: 7.815982,
      label: 'A',
      draggable: true
    },
    {
      lat: 51.373858,
      lng: 7.215982,
      label: 'B',
      draggable: false
    },
    {
      lat: 51.723858,
      lng: 7.895982,
      label: 'C',
      draggable: true
    }
  ]
}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
