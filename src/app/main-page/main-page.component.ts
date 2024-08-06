import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, viewChild, ɵDeferBlockConfig } from '@angular/core';
import { User } from '../../Models/User';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { CommonModule } from '@angular/common';
import { Conversation } from '../../Models/Conversation';
import { ConversationService } from '../conversation.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserContact } from '../../Models/UserContact';
import { ConnectionRequest } from '../../Models/ConnectionRequest';
import { UserLogin } from '../../Models/UserLogin';


@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit, AfterViewInit {

  user: User | null = null;
  activedConversation : Conversation | null = null;

  dataForm: FormGroup;
  selectorForm: FormGroup;

  isConversationMode : boolean = true; 
  isFindContactsMode : boolean = false;
  isResponseConnectRequestMode :boolean = false;

  contactsStartWith :UserContact[] =[];
  connectionRequests : ConnectionRequest[] =[];
  @ViewChild('scrollerContainer') scrollerContainer!:ElementRef

  constructor(private router: Router,
     private userService: UsersService,
     private conversationService: ConversationService,
     private formBuilder: FormBuilder
    ){
      this.dataForm = this.formBuilder.group({
        messagesDisplayer :[],
        messageSender:[''],
        txtStartWith:[''],
        connectionRequestDisplayer:[]
      });

      this.selectorForm = this.formBuilder.group({
        selectorDisplayer: []
      })
    }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
      this.userService.user$.subscribe((user: User | null) =>{
        console.log(user);
        this.user= user;
     })
  }

  selectConversation(id:number | undefined, name:string | undefined){
    console.log("send request to get", id , name);
    this.conversationService.GetConversation(id, this.user).subscribe({
      next: (conver) => {
        this.activedConversation = conver;
        if(name != undefined)
        {
          this.activedConversation.name = name;
        }
        
        console.log("active conversation" , this.activedConversation);
        
        this.dataForm.reset();
        this.scrollMessageControllerDown();
      },
      error: (err) =>{
        console.log(err.message);
      }
    })
  }

  sendMessage(){
    console.log(this.dataForm.value.messageSender);
    this.conversationService.SendMessage(this.activedConversation?.conversationId,
      this.user,this.dataForm.value.messageSender).subscribe({
        next: () =>{
          this.selectConversation(this.activedConversation?.conversationId, this.activedConversation?.name);
          this.dataForm.reset();
          const conversations = this.user?.conversations.filter( con => con.conversationId != this.activedConversation?.conversationId);
          
          if(this.user !=null && conversations != undefined && this.activedConversation != null)
          {
            this.user.conversations = conversations;
            this.user.conversations.unshift({
              conversationId: this.activedConversation.conversationId,
              participantIds: this.activedConversation.participants.map(par => par.userId),
              messageIds: this.activedConversation.messages.map( mes => mes.messageId),
              startTime: this.activedConversation.startTime,
              lastMessageTime: new Date,
              name: this.activedConversation.name
            });

            console.log(this.user.conversations[0]);
            console.log(this.activedConversation.name);

            this.selectorForm.reset();
            this.scrollMessageControllerDown();
          }
        },
        error: (err) => {
          console.log(err.message);
        }

      })
  }

  logOut(){
    this.userService.clearUser();
    this.router.navigate(['/']);
  }

  changeToContactMode(){
    this.isConversationMode=false;
    this.isFindContactsMode=false;
    this.isResponseConnectRequestMode=false;
  }

  changeToConversationMode(){
    this.isConversationMode=true;
    this.isFindContactsMode=false;
    this.isResponseConnectRequestMode=false;

    this.conversationService.GetAllUserConversationsDTO(this.user).subscribe({
      next: (convesations) => {
        if(this.user != null)
        {
          this.user.conversations = convesations;

          this.user.conversations.forEach(con => {
            const parIds = con.participantIds;
            console.log("this is parIds:", parIds);
            const parNames = this.user?.contacts.filter(us => parIds.includes(us.userId)).map(us => us.username);
            console.log("this is parNames:", parNames);
            con.name = parNames?.filter(par => par != this.user?.username)[0]? parNames?.filter(par => par != this.user?.username)[0]:'Unknown';
          });

          this.userService.updateUser(this.user);
          this.selectConversation(this.user.conversations[0].conversationId,this.user.conversations[0].name);
          this.selectorForm.reset();
        }
      },
      error: (err) =>{
        console.log(err);
      }
    })
  }

  scrollMessageControllerDown(){
    const container = this.scrollerContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
    console.log(container);
  }

  selectFindContacts()
  {
    this.isConversationMode =false;
    this.isFindContactsMode =true;
    this.isResponseConnectRequestMode=false;
  }

  selectResponseConnectRequestMode()
  {
    this.isConversationMode =false;
    this.isFindContactsMode =false;
    this.isResponseConnectRequestMode=true;

    this.getAllConnectionReqeusts();
  }

  findContactsStartWith(){
    console.log(this.dataForm.value.txtStartWith)
    this.userService.GetContectStartWith(this.dataForm.value.txtStartWith).subscribe({
      next: (contacts) =>{
        this.contactsStartWith = contacts;
        console.log(contacts[0]);
        console.log(this.contactsStartWith[0])
      },
      error: (err) =>{
        console.log(err);
        this.contactsStartWith =[]
      }
    })
  }

  sendConnectRequestTo(toId: number){
    console.log(this.user);
    this.userService.SendConnectRequest(toId, this.user).subscribe({
      next: () =>{
        console.log('request has sent');
      },
      error : (err)=>{
        console.log(err);
      }
    })
  }

  getAllConnectionReqeusts(){
    this.userService.GetAllConnectionRequest(this.user).subscribe({
      next: (requests) =>{
        this.connectionRequests = requests;

        this.connectionRequests.forEach(request =>{
          this.userService.GetUserById(request.requesterId).subscribe({
            next: (contact) =>{
              request.requesterUsername =contact.username
              request.requesterFullName = contact.fullName;
            },
            error: (err) =>{
              console.log(err);
            }
          })
        });
      },
      error: (err) =>{
        console.log(err);
      }
    });
  }

  responseToConnectionRequest(requestId:number, response: boolean){
    console.log(requestId, response)
    if(this.user != null)
    {
      this.userService.ResponseConnectionRequest(requestId,response, this.user?.passwordHash).subscribe({
        next: () =>{
          if(this.user!=null)
          {
            this.userService.LoginUser({
              username: this.user.username,
              password: this.user.passwordHash
            }).subscribe({
              next: (user)=>{
                this.user=user;
                this.userService.updateUser(user);
              },

              error: (err)=>{
                console.log(err);
              }
            })
          }
        
          this.connectionRequests = this.connectionRequests.filter( req => req.id != requestId);
          this.dataForm.reset();
        },
        error: (err) =>{
          console.log(err);
        }
      });
    }
  }

}
