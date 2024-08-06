import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conversation } from '../Models/Conversation';
import { User } from '../Models/User';
import { ConversationDTO } from '../Models/ConverstionDTO';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private apiUrl = "https://localhost:7235/api"

  constructor(private http:HttpClient) { }

  GetConversation(id:number | undefined, user: User |null) : Observable<Conversation>{
    return this.http.get<Conversation>(`${this.apiUrl}/Conversation/${id}?userId=${user?.userId}&password=${user?.passwordHash}`);
  }

  SendMessage(conversationId:number |undefined, user:User|null, content:string): Observable<void>{
    return this.http.post<void>(`${this.apiUrl}/Conversation/sendmessage`,
      {senderId: user?.userId, senderUsername: user?.username,senderPassword: user?.passwordHash, conversationId: conversationId, content: content}
    );
  }

  GetAllUserConversationsDTO(user: User | null): Observable<ConversationDTO[]>{
    return this.http.get<ConversationDTO[]>(
      `${this.apiUrl}/Conversation/getconversations/${user?.userId}?password=${user?.passwordHash}`);
  }
}
