import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  
  @Output() logInFormIsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  closeLogInForm(): void {
    this.logInFormIsOpen.emit(false);
  }
}
