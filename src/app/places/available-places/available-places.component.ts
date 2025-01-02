import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { Place } from '../place.model';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent, NgxSpinnerModule],
  providers: [NgxSpinnerService]
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  error = signal('')

  private placeService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  private spinner = inject(NgxSpinnerService);

  ngOnInit(): void {
    this.spinner.show();
    const fetchData = this.placeService.loadAvailablePlaces()
    .subscribe({
      next: (resData) => {this.places.set(resData)},
      error: (err) => this.error.set(err.message),
      complete: () => this.spinner.hide()
    })

    this.destroyRef.onDestroy(() => {
      fetchData.unsubscribe()
    })
  }

  onSelectPlace(place: Place) {
    this.placeService.addPlaceToUserPlaces(place).subscribe();
  }
}
