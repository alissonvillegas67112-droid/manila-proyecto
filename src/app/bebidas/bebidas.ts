import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Bebida } from '../entidades/bebida';
import { Producto } from '../entidades/producto';
import { BebidaService } from '../servicios/bebida.service';
import { CarritoService } from '../servicios/carrito.service';
import { PrecioService } from '../servicios/precio.service';
import { DetalleProducto } from '../detalle-producto/detalle-producto';

@Component({
  standalone: true,
  imports: [FormsModule, DetalleProducto],
  selector: 'app-bebidas',
  styleUrl: './bebidas.css',
  templateUrl: './bebidas.html',
})
export class Bebidas implements OnInit {

  bebidas: Bebida[] = [];
  busqueda: string = '';
  tipoBusqueda: 'nombre' | 'ingrediente' = 'nombre';
  filtroAlcohol: 'Alcoholic' | 'Non_Alcoholic' | '' = 'Alcoholic';
  filtroCategoria: 'Ordinary_Drink' | 'Cocktail' | '' = '';
  cargando: boolean = false;
  error: string = '';
  mensajeCarrito: string = '';

  detalle: Bebida | null = null;
  cargandoDetalle: boolean = false;
  errorDetalle: string = '';

  private bebidaService = inject(BebidaService);
  private carritoService = inject(CarritoService);
  private cdr = inject(ChangeDetectorRef);
  precioService = inject(PrecioService);

  ngOnInit(): void {
    this.seleccionarAlcohol('Alcoholic');
  }

  seleccionarAlcohol(tipo: 'Alcoholic' | 'Non_Alcoholic'): void {
    this.filtroAlcohol = tipo;
    this.filtroCategoria = '';
    this.busqueda = '';
    this.cargarBebidas(this.bebidaService.listarPorAlcohol(tipo));
  }

  seleccionarCategoria(categoria: 'Ordinary_Drink' | 'Cocktail'): void {
    this.filtroCategoria = categoria;
    this.filtroAlcohol = '';
    this.busqueda = '';
    this.cargarBebidas(this.bebidaService.listarPorCategoria(categoria));
  }

  buscar(): void {
    const texto = this.busqueda.trim();

    if (texto === '') {
      this.error = 'Escribe un nombre o un ingrediente para buscar.';
      return;
    }

    this.filtroAlcohol = '';
    this.filtroCategoria = '';
    this.error = '';

    if (this.tipoBusqueda === 'nombre') {
      this.cargarBebidas(this.bebidaService.buscarPorNombre(texto));
    } else {
      this.cargarBebidas(this.bebidaService.buscarPorIngrediente(texto));
    }
  }

  limpiarBusqueda(): void {
    this.busqueda = '';
    this.error = '';
    this.seleccionarAlcohol('Alcoholic');
  }

  verDetalle(bebida: Bebida): void {
    this.detalle = null;
    this.errorDetalle = '';
    this.cargandoDetalle = true;

    this.bebidaService.obtenerDetalle(bebida.id)
      .then(detalle => {
        this.detalle = detalle;
        this.cargandoDetalle = false;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.errorDetalle = 'No se pudo cargar el detalle de la bebida.';
        this.cargandoDetalle = false;
        this.cdr.detectChanges();
      });
  }

  cerrarDetalle(): void {
    this.detalle = null;
    this.cargandoDetalle = false;
    this.errorDetalle = '';
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregar(producto);
    this.mensajeCarrito = producto.nombre + ' se agregó al carrito.';
  }

  private cargarBebidas(consulta: Promise<Bebida[]>): void {
    this.cargando = true;
    this.error = '';

    consulta
      .then(bebidas => {
        this.bebidas = bebidas;
        this.cargando = false;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.error = 'No se pudieron cargar las bebidas. Intenta nuevamente.';
        this.cargando = false;
        this.cdr.detectChanges();
      });
  }

}
