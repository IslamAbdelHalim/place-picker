import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';

import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpClient = inject(HttpClient);
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'there is a problem in places');
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places', 'there is a problem in user places').pipe(tap({
      next: (userPlaces) => this.userPlaces.set(userPlaces)
    }));
  }

  addPlaceToUserPlaces(place: Place) {
    this.userPlaces.update((prePlaces) => [...prePlaces, place])
    return this.httpClient.put<{userPlace: Place[]}>('http://localhost:3000/user-places', {
      placeId: place.id
    });
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url: string, errMessage: string) {
    return this.httpClient.get<{places: Place[]}>(url)
    .pipe(
      map((resData) => resData.places),
      catchError((err) => {
        console.log(err);
        return throwError(() => new Error(errMessage))
      })
    ) 
  }
}
