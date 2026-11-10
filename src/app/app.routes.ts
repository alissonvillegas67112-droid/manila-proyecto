import { Routes } from '@angular/router';
import { Platos } from './platos/platos';
import { Bebidas } from './bebidas/bebidas';
import { Carrito } from './carrito/carrito';
import { Juego } from './juego/juego';

export const routes: Routes = [

  { path: 'platos', component: Platos },
  { path: 'bebidas', component: Bebidas },
  { path: 'juego', component: Juego },
  { path: 'carrito', component: Carrito },
  { path: '**', redirectTo: '' }

];
