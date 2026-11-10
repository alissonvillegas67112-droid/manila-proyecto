import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrecioService {

  private precios = new Map<string, number>();

  obtenerPrecio(id: string, tipo: 'comida' | 'bebida'): number {
    const clave = tipo + '-' + id;
    const precioGuardado = this.precios.get(clave);

    if (precioGuardado !== undefined) {
      return precioGuardado;
    }

    const precio = this.generarPrecio(tipo);
    this.precios.set(clave, precio);
    return precio;
  }

  formatearPrecio(precio: number): string {
    return '$ ' + precio.toLocaleString('es-CO') + ' COP';
  }

  private generarPrecio(tipo: 'comida' | 'bebida'): number {
    const minimo = tipo === 'comida' ? 15000 : 8000;
    const maximo = tipo === 'comida' ? 55000 : 30000;
    const pasos = (maximo - minimo) / 1000;
    return minimo + Math.floor(Math.random() * (pasos + 1)) * 1000;
  }

}
