import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  @Output() signUpFormIsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  closeSignUpForm(): void {
    this.signUpFormIsOpen.emit(false);
  }
}
