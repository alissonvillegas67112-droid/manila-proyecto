import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './navegacion.css',
  templateUrl: './navegacion.html',
})
export class Navegacion {}
