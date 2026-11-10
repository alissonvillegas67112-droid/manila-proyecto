import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Cliente } from '../entidades/cliente';
import { ItemCarrito } from '../entidades/producto';
import { CarritoService } from '../servicios/carrito.service';
import { PdfService } from '../servicios/pdf.service';
import { PrecioService } from '../servicios/precio.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito implements OnInit {

  cliente!: Cliente;
  mensaje: string = '';
  error: string = '';

  carritoService = inject(CarritoService);
  pdfService = inject(PdfService);
  precioService = inject(PrecioService);

  ngOnInit(): void {
    this.cliente = new Cliente();
  }

  get items(): ItemCarrito[] {
    return this.carritoService.obtenerItems();
  }

  get total(): number {
    return this.carritoService.total();
  }

  get unidades(): number {
    return this.carritoService.contarUnidades();
  }

  aumentar(item: ItemCarrito): void {
    this.carritoService.aumentar(item);
  }

  disminuir(item: ItemCarrito): void {
    this.carritoService.disminuir(item);
  }

  eliminar(item: ItemCarrito): void {
    this.carritoService.eliminar(item);
  }

  vaciarCarrito(): void {
    this.carritoService.vaciar();
    this.mensaje = 'El carrito fue vaciado.';
    this.error = '';
  }

  realizarPedido(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.cliente.nombre || !this.cliente.celular || !this.cliente.direccion) {
      this.error = 'Completa el nombre, el celular y la dirección para realizar el pedido.';
      return;
    }

    if (this.items.length === 0) {
      this.error = 'Agrega al menos un plato o una bebida al carrito.';
      return;
    }

    try {
      this.pdfService.generarPedido(this.cliente, this.items, this.total);
      this.carritoService.vaciar();
      this.mensaje = 'Pedido generado correctamente. El carrito fue vaciado.';
    } catch (error) {
      this.error = 'No se pudo generar el PDF. Intenta nuevamente.';
    }
  }

  limpiarCliente(): void {
    this.cliente = new Cliente();
    this.mensaje = '';
    this.error = '';
  }

}
