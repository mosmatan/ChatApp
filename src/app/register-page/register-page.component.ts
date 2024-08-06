import { Component } from '@angular/core';
import { Router, } from '@angular/router';
import { UserRegister } from '../../Models/UserRegister';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  
  user : UserRegister ={
    username: '',
    password: '',
    fullname: ''
  }

  constructor(private usersService: UsersService, private router :Router){}

  onSubmit(): void{
    this.usersService.RegisterUser(this.user).subscribe({
      next: (user) => {
        console.log(user);
        this.usersService.updateUser(user);
        this.router.navigate(['/main']);
      },
      error: (err) =>{
        console.log(err);
      }
    });
  }

}
