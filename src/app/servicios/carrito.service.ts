import { Injectable } from '@angular/core';
import { ItemCarrito, Producto } from '../entidades/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private items: ItemCarrito[] = [];

  obtenerItems(): ItemCarrito[] {
    return this.items;
  }

  agregar(producto: Producto): void {
    const item = this.items.find(
      actual => actual.producto.id === producto.id && actual.producto.tipo === producto.tipo
    );

    if (item) {
      item.cantidad = item.cantidad + 1;
    } else {
      this.items.push({ producto: producto, cantidad: 1 });
    }
  }

  aumentar(item: ItemCarrito): void {
    item.cantidad = item.cantidad + 1;
  }

  disminuir(item: ItemCarrito): void {
    if (item.cantidad > 1) {
      item.cantidad = item.cantidad - 1;
    }
  }

  eliminar(item: ItemCarrito): void {
    this.items = this.items.filter(
      actual => !(actual.producto.id === item.producto.id && actual.producto.tipo === item.producto.tipo)
    );
  }

  vaciar(): void {
    this.items = [];
  }

  contarUnidades(): number {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  subtotal(item: ItemCarrito): number {
    return item.producto.precio * item.cantidad;
  }

  total(): number {
    return this.items.reduce((total, item) => total + this.subtotal(item), 0);
  }

}
