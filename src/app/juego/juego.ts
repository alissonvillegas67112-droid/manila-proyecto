import { Component, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';

interface Casilla {
  id: number;
  tipo: 'comida' | 'bebida' | null;
  descubierta: boolean;
}

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [],
  templateUrl: './juego.html',
  styleUrl: './juego.css'
})
export class Juego implements OnDestroy {

  // Imágenes que el jugador debe encontrar.
  imagenComida = 'images/pasta.jpg';
  imagenBebida = 'images/cocktail.jpg';

  casillas: Casilla[] = this.crearCasillasVacias();
  juegoActivo = false;
  juegoTerminado = false;
  comidaEncontrada = false;
  bebidaEncontrada = false;
  mensaje = 'Presiona "Jugar" para comenzar.';

  private cdr = inject(ChangeDetectorRef);
  private tiempoReinicio: any = null;

  ngOnDestroy(): void {
    if (this.tiempoReinicio) {
      clearTimeout(this.tiempoReinicio);
    }
  }

  // Crea un tablero nuevo de 4 x 4 y esconde el plato y la bebida
  // en dos posiciones diferentes.
  jugar(): void {
    if (this.tiempoReinicio) {
      clearTimeout(this.tiempoReinicio);
      this.tiempoReinicio = null;
    }

    this.casillas = this.crearCasillasVacias();

    const posicionComida = Math.floor(Math.random() * 16);
    let posicionBebida = Math.floor(Math.random() * 16);

    while (posicionBebida === posicionComida) {
      posicionBebida = Math.floor(Math.random() * 16);
    }

    this.casillas[posicionComida].tipo = 'comida';
    this.casillas[posicionBebida].tipo = 'bebida';

    this.juegoActivo = true;
    this.juegoTerminado = false;
    this.comidaEncontrada = false;
    this.bebidaEncontrada = false;
    this.mensaje = 'Busca el plato y la bebida entre las 16 casillas.';
  }

  // Se ejecuta cuando el jugador hace clic en una casilla.
  descubrir(casilla: Casilla): void {
    if (!this.juegoActivo || this.juegoTerminado || casilla.descubierta) {
      return;
    }

    // La casilla no tiene ninguna de las dos imágenes.
    if (casilla.tipo === null) {
      this.mensaje = 'Intenta de nuevo.';
      return;
    }

    casilla.descubierta = true;

    if (casilla.tipo === 'comida') {
      this.comidaEncontrada = true;
    } else {
      this.bebidaEncontrada = true;
    }

    if (this.comidaEncontrada && this.bebidaEncontrada) {
      this.juegoTerminado = true;
      this.mensaje = '¡Encontraste el plato y la bebida! Iniciando otra partida...';

      // Después de unos segundos, el juego vuelve a empezar
      // con las imágenes en posiciones diferentes.
      this.tiempoReinicio = setTimeout(() => {
        this.jugar();
        this.cdr.detectChanges();
      }, 2200);
    } else if (casilla.tipo === 'comida') {
      this.mensaje = '¡Encontraste el plato! Ahora busca la bebida.';
    } else {
      this.mensaje = '¡Encontraste la bebida! Ahora busca el plato.';
    }
  }

  obtenerImagen(casilla: Casilla): string {
    return casilla.tipo === 'comida' ? this.imagenComida : this.imagenBebida;
  }

  obtenerNombre(casilla: Casilla): string {
    return casilla.tipo === 'comida' ? 'Plato' : 'Bebida';
  }

  // Crea las 16 casillas del tablero, todas tapadas.
  private crearCasillasVacias(): Casilla[] {
    const casillas: Casilla[] = [];

    for (let i = 1; i <= 16; i++) {
      casillas.push({
        id: i,
        tipo: null,
        descubierta: false
      });
    }

    return casillas;
  }

}
