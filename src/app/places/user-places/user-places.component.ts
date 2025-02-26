import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{
  error = signal<String>('');
  isFetching = signal<Boolean>(false);
  
  private placesService = inject(PlacesService)
  private destroyRef = inject(DestroyRef);

  places = this.placesService.loadedUserPlaces;
  
  ngOnInit(): void {
    this.isFetching.set(true)
    const fetchData = this.placesService.loadUserPlaces()
    .subscribe({
      error: (err: Error) => this.error.set(err.message),
      complete: () => this.isFetching.set(true)
    })

    this.destroyRef.onDestroy(() => {
      fetchData.unsubscribe();
    })
  }

  onSelectPlace(place: Place) {
    this.placesService.removeUserPlace(place.id).subscribe();
  }
}
