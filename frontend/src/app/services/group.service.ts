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

  // Get all groups for current user (authenticated)
  getUserGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  // Get group by ID with enhanced details
  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }

  // Create new group with enhanced features
  createGroup(groupData: any): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, groupData);
  }

  // Update group
  updateGroup(id: number, groupData: any): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${id}`, groupData);
  }

  // Delete group
  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Add member to group
  addMemberToGroup(groupId: number, userId: number): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/${groupId}/members/${userId}`, {});
  }

  // Remove member from group
  removeMemberFromGroup(groupId: number, userId: number): Observable<Group> {
    return this.http.delete<Group>(`${this.apiUrl}/${groupId}/members/${userId}`);
  }

  // Get group expenses
  getGroupExpenses(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${groupId}/expenses`);
  }

  // Get group members
  getGroupMembers(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${groupId}/members`);
  }

  // Get group summary/statistics
  getGroupSummary(groupId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${groupId}/summary`);
  }

  // Archive/Unarchive group
  toggleGroupArchive(groupId: number, archived: boolean): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${groupId}/archive`, { archived });
  }

  // Update group settings
  updateGroupSettings(groupId: number, settings: any): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${groupId}/settings`, settings);
  }
}
