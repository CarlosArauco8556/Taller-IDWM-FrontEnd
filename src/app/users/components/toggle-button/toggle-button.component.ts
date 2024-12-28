import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'users-toggle-button',
  standalone: true,
  imports: [],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.css'
})
export class ToggleButtonComponent {
  constructor(private router: Router) { }

  navigateTo(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const route = selectElement.value;
    if(route){
      this.router.navigate([route]);
    }
  }
}
