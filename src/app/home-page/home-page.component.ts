import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { UsersService } from '../users.service';
import { UserLogin } from '../../Models/UserLogin';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  title = 'ChatApp';

  user : UserLogin ={
    username: '',
    password: ''
  }

  constructor( private userService: UsersService, private router: Router){}

  onSubmit(): void{
    this.userService.LoginUser(this.user).subscribe({
      next: (user) =>{
        user.conversations.forEach(con => {
          const parIds = con.participantIds;
          const parNames = user.contacts.filter(us => parIds.includes(us.userId)).map(us => us.username);
          con.name = parNames.filter(par => par != user.username)[0];
          console.log(con.name);
        });
        this.userService.updateUser(user);
        this.router.navigate(['/main']);
      },
      error: (err) =>{
        console.log(err.error);
      }
    });
  }
}
