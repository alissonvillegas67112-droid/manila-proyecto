import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Plato } from '../entidades/plato';
import { Bebida } from '../entidades/bebida';
import { PrecioService } from '../servicios/precio.service';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css'
})
export class DetalleProducto {

  @Input() producto: Plato | Bebida | null = null;
  @Input() cargando: boolean = false;
  @Input() error: string = '';
  @Output() cerrar = new EventEmitter<void>();
  @Output() agregar = new EventEmitter<Plato | Bebida>();

  precioService = inject(PrecioService);

  cerrarModal(): void {
    this.cerrar.emit();
  }

  agregarAlCarrito(): void {
    if (this.producto) {
      this.agregar.emit(this.producto);
    }
  }

}
