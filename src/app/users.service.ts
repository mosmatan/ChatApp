import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegister } from '../Models/UserRegister';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../Models/User';
import { UserLogin } from '../Models/UserLogin';
import { UserContact } from '../Models/UserContact';
import { ConnectionRequest } from '../Models/ConnectionRequest';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = "https://localhost:7235/api/User/"

  private userSubject: BehaviorSubject<User | null>;
  user$: any;

  constructor(private http : HttpClient) {
    const userData = localStorage.getItem('user');
    this.userSubject = new BehaviorSubject<User | null>(userData ? JSON.parse(userData) : null);
    this.user$ = this.userSubject.asObservable();
   }

  updateUser(user: User) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }

  // Method to get the current user data
  getUser(): User | null {
    return this.userSubject.value;
  }

  RegisterUser(user : UserRegister):Observable<User>
  {
      return this.http.post<User>(`${this.apiUrl}register`, user);
  }

  LoginUser(user : UserLogin): Observable<User>
  {
    return this.http.get<User>(`${this.apiUrl}login?username=${user.username}&password=${user.password}`);
  }

  GetContactStartWith(startWith : string):Observable<UserContact[]>{
    return this.http.get<UserContact[]>(`${this.apiUrl}contact/startwith/${startWith}`);
  }

  SendConnectRequest(toId:number ,user: User |null): Observable<void>{
    if(user !=null)
    {
      return this.http.post<void>(`${this.apiUrl}contact/sendcontactrequest`, {requesterId: user.userId, recipientId: toId, requesterPassword: user.passwordHash});
    }
    return this.http.post<void>(`${this.apiUrl}contact/sendcontactrequest`, {requesterId: 0, recipientId: toId, requesterPassword: 0});
  }

  GetAllConnectionRequest(user: User |null): Observable<ConnectionRequest[]>{
    if(user != null)
    {
      return this.http.get<ConnectionRequest[]>(`${this.apiUrl}contact/requestsentto/${user.userId}`);
    }
    else
    {
      return this.http.get<ConnectionRequest[]>(`${this.apiUrl}contact/requestsentto/0`);
    }
    
  }

  GetUserById(id: number):Observable<UserContact>{
    return this.http.get<UserContact>(`${this.apiUrl}contact/id/${id}`);
  }

  ResponseConnectionRequest(requestId:number, response:boolean, password: string):Observable<void>{
    const respo= {
      requestId: requestId,
      isAprroved: response,
      password: password
    }

    console.log(respo);
    return this.http.put<void>(`${this.apiUrl}contact/responsecontactrequest`, respo);
  }
}
