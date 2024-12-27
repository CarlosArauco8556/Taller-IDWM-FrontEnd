import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'management-users-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './management-users-page.component.html',
  styleUrl: './management-users-page.component.css'
})
export class ManagementUsersPageComponent {

}
