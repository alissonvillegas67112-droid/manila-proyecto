import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Plato } from '../entidades/plato';
import { Bebida } from '../entidades/bebida';
import { ComidaService } from '../servicios/comida.service';
import { BebidaService } from '../servicios/bebida.service';
import { PrecioService } from '../servicios/precio.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio implements OnInit, OnDestroy {

  imagenes = [
    {
      imagen: 'images/restaurante-1.jpg',
      titulo: 'Un espacio para compartir',
      texto: 'Luces cálidas, madera y detalles dorados para disfrutar sin prisa.'
    },
    {
      imagen: 'images/restaurante-2.jpg',
      titulo: 'Momentos alrededor de la mesa',
      texto: 'Una mesa bien servida es la mejor excusa para reunirse.'
    },
    {
      imagen: 'images/restaurante-3.jpg',
      titulo: 'Sabores que se recuerdan',
      texto: 'Ingredientes frescos y una cocina que cuida cada detalle.'
    }
  ];

  indice = 0;
  intervalo: any;

  platoDestacado: Plato | null = null;
  bebidaDestacada: Bebida | null = null;
  cargandoPlato = true;
  cargandoBebida = true;
  errorPlato = '';
  errorBebida = '';

  private cdr = inject(ChangeDetectorRef);
  private comidaService = inject(ComidaService);
  private bebidaService = inject(BebidaService);
  precioService = inject(PrecioService);

  ngOnInit(): void {
    this.intervalo = setInterval(() => {
      this.siguiente();
      this.cdr.detectChanges();
    }, 4000);

    this.cargarPlatoDestacado();
    this.cargarBebidaDestacada();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  cargarPlatoDestacado(): void {
    this.cargandoPlato = true;
    this.errorPlato = '';

    this.comidaService.obtenerComidaAleatoria()
      .then(plato => {
        this.platoDestacado = plato;
        this.cargandoPlato = false;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.errorPlato = 'No se pudo cargar el plato destacado.';
        this.cargandoPlato = false;
        this.cdr.detectChanges();
      });
  }

  cargarBebidaDestacada(): void {
    this.cargandoBebida = true;
    this.errorBebida = '';

    this.bebidaService.obtenerBebidaAleatoria()
      .then(bebida => {
        this.bebidaDestacada = bebida;
        this.cargandoBebida = false;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.errorBebida = 'No se pudo cargar la bebida destacada.';
        this.cargandoBebida = false;
        this.cdr.detectChanges();
      });
  }

  anterior(): void {
    if (this.indice === 0) {
      this.indice = this.imagenes.length - 1;
    } else {
      this.indice = this.indice - 1;
    }
  }

  siguiente(): void {
    if (this.indice === this.imagenes.length - 1) {
      this.indice = 0;
    } else {
      this.indice = this.indice + 1;
    }
  }

  irA(indice: number): void {
    this.indice = indice;
  }

}
