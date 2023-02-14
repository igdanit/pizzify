import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { IUserCredentials } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  @Output() onModerator = new EventEmitter();

  // User credentials
  logInForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
    ) {}

  onSubmit() :void {
    if (
      this.logInForm.value.password && // Checking all (undefined, null, '', 0, ...)
      this.logInForm.value.username) {
       if (
         this.isValidPassword(this.logInForm.value.password) &&
         this.isValidUsername(this.logInForm.value.username)
       ) {
         this.authService.logIn(this.logInForm.value as IUserCredentials, ()=>this.onModerator.emit(true))
        } else {
          // Notify the user about incorrect pass or username
          console.error("Username and Password is invalid")
        }
    } else {
      console.error("Username and Password must be not empty")
    }
    this.logInForm.reset();
  }

  // Check presence of forbidden characters
  isValidPassword(password: string): boolean {
    return true
  }

  // Check presence of forbidden characters
  isValidUsername(username: string): boolean {
    return true
  }

}
