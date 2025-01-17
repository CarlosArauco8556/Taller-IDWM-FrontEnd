import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NavBarComponent } from "./_shared/components/nav-bar/nav-bar.component";
import { ToastComponent } from './_shared/components/toast/toast.component';
import { LOCALE_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Taller-IDWM-FrontEnd';

  ngOnInit(): void {
    initFlowbite();
  }
}
