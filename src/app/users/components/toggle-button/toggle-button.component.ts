import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
/**
 * Componente que se encarga de mostrar un botón que permite cambiar entre paginas.
 */
@Component({
  selector: 'users-toggle-button',
  standalone: true,
  imports: [],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.css'
})
export class ToggleButtonComponent {
  /**
   * Constructor que inyecta el router
   * @param router Router de la aplicación 
   */
  constructor(private router: Router) { }

  /**
   * Metodo que se encarga de navegar a la ruta de la pagina seleccionada. 
   * @param event Evento que se produce al seleccionar una opción del select.
   */
  navigateTo(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const route = selectElement.value;
    if(route){
      this.router.navigate([route]);
    }
  }
}
