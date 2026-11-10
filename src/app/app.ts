import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navegacion } from './navegacion/navegacion';
import { Inicio } from './inicio/inicio';
import { Footer } from './footer/footer';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [RouterOutlet, Navegacion, Inicio, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {

  title = 'manila-proyecto';

  private router = inject(Router);
  esRutaInicio = true;

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.esRutaInicio = event.urlAfterRedirects === '/';
      });
  }

}
