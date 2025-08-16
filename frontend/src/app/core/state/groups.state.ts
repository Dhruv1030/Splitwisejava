import { Injectable, Signal, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Group, CreateGroupRequest } from '../models/group.model';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupsState {
  // Signal for groups collection
  private groups = signal<Group[]>([]);

  // Signal for loading state
  private loading = signal<boolean>(false);
  
  // Signal for error state
  private error = signal<string | null>(null);

  // Computed signals for derived state
  public groups$: Signal<Group[]> = computed(() => this.groups());
  public loading$: Signal<boolean> = computed(() => this.loading());
  public error$: Signal<string | null> = computed(() => this.error());

  // Computed signal for sorted groups (most recently updated first)
  public sortedGroups$: Signal<Group[]> = computed(() => {
    return [...this.groups()].sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  });

  constructor(private http: HttpClient) {}

  loadGroups(): Observable<Group[]> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.get<Group[]>('/api/groups')
      .pipe(
        tap(groups => {
          this.groups.set(groups);
          this.loading.set(false);
        }),
        catchError(err => {
          this.error.set('Failed to load groups');
          this.loading.set(false);
          return of([]);
        })
      );
  }

  createGroup(groupData: CreateGroupRequest): Observable<Group> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Group>('/api/groups', groupData)
      .pipe(
        tap(newGroup => {
          // Update groups signal with new group
          this.groups.update(groups => [...groups, newGroup]);
          this.loading.set(false);
        }),
        catchError(err => {
          this.error.set('Failed to create group');
          this.loading.set(false);
          throw err;
        })
      );
  }

  // Get a single group by ID
  getGroupById(id: string): Signal<Group | undefined> {
    return computed(() => this.groups().find(group => group.id === id));
  }
}
