import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Plato } from '../entidades/plato';
import { Producto } from '../entidades/producto';
import { ComidaService } from '../servicios/comida.service';
import { CarritoService } from '../servicios/carrito.service';
import { PrecioService } from '../servicios/precio.service';
import { DetalleProducto } from '../detalle-producto/detalle-producto';

@Component({
  standalone: true,
  imports: [FormsModule, DetalleProducto],
  selector: 'app-platos',
  styleUrl: './platos.css',
  templateUrl: './platos.html',
})
export class Platos implements OnInit {

  platos: Plato[] = [];
  categorias: string[] = [];
  categoriaSeleccionada: string = '';
  busqueda: string = '';
  tipoBusqueda: 'nombre' | 'ingrediente' = 'nombre';
  cargando: boolean = false;
  error: string = '';
  mensajeCarrito: string = '';

  detalle: Plato | null = null;
  cargandoDetalle: boolean = false;
  errorDetalle: string = '';

  private comidaService = inject(ComidaService);
  private carritoService = inject(CarritoService);
  private cdr = inject(ChangeDetectorRef);
  precioService = inject(PrecioService);

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando = true;
    this.error = '';

    this.comidaService.obtenerCategorias()
      .then(categorias => {
        this.categorias = categorias;
        this.cargando = false;

        if (categorias.length > 0) {
          this.seleccionarCategoria(categorias[0]);
        }

        this.cdr.detectChanges();
      })
      .catch(() => {
        this.error = 'No se pudieron cargar las categorías. Revisa tu conexión.';
        this.cargando = false;
        this.cdr.detectChanges();
      });
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
    this.busqueda = '';
    this.cargarPlatos(this.comidaService.obtenerComidasPorCategoria(categoria));
  }

  buscar(): void {
    const texto = this.busqueda.trim();

    if (texto === '') {
      this.error = 'Escribe un nombre o un ingrediente para buscar.';
      return;
    }

    this.categoriaSeleccionada = '';
    this.error = '';

    if (this.tipoBusqueda === 'nombre') {
      this.cargarPlatos(this.comidaService.buscarPorNombre(texto));
    } else {
      this.cargarPlatos(this.comidaService.buscarPorIngrediente(texto));
    }
  }

  limpiarBusqueda(): void {
    this.busqueda = '';
    this.error = '';

    if (this.categorias.length > 0) {
      this.seleccionarCategoria(this.categorias[0]);
    } else {
      this.cargarCategorias();
    }
  }

  verDetalle(plato: Plato): void {
    this.detalle = null;
    this.errorDetalle = '';
    this.cargandoDetalle = true;

    this.comidaService.obtenerDetalle(plato.id)
      .then(detalle => {
        this.detalle = detalle;
        this.cargandoDetalle = false;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.errorDetalle = 'No se pudo cargar el detalle del plato.';
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

  private cargarPlatos(consulta: Promise<Plato[]>): void {
    this.cargando = true;
    this.error = '';

    consulta
      .then(platos => {
        this.platos = platos;
        this.cargando = false;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.error = 'No se pudieron cargar los platos. Intenta nuevamente.';
        this.cargando = false;
        this.cdr.detectChanges();
      });
  }

}
