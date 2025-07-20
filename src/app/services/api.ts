import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse, Character } from '../models/character';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly API_URL = ' https://rickandmortyapi.com/api/character'; 

  private readonly http = inject(HttpClient); // Inyección de HttpClient

  private charactersSignal = signal<Character[]>([]); // Señal privada inicializada como arreglo vacío

  public readonly characters = this.charactersSignal.asReadonly(); // Señal pública de solo lectura

  getCharacters(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      tap(response => {
        this.charactersSignal.set(response.results);
      })
    );
  }

  searchCharacters(name: string): Observable<ApiResponse> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return this.getCharacters();
    }
    const searchUrl = `${this.API_URL}?name=${encodeURIComponent(trimmedName)}`;
    return this.http.get<ApiResponse>(searchUrl).pipe(
      tap(response => {
        this.charactersSignal.set(response.results);
      })
    );
  }
}
