import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, GroupDto } from '../models/group.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = `${environment.apiUrl}/groups`;

  constructor(private http: HttpClient) { }

  createGroup(groupDto: GroupDto): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, groupDto);
  }

  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }

  getGroupsByUserId(userId: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateGroup(id: number, groupDto: GroupDto): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${id}`, groupDto);
  }

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addMemberToGroup(groupId: number, userId: number): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/${groupId}/members/${userId}`, {});
  }

  removeMemberFromGroup(groupId: number, userId: number): Observable<Group> {
    return this.http.delete<Group>(`${this.apiUrl}/${groupId}/members/${userId}`);
  }
}
