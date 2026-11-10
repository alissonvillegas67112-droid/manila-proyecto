import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Carrito } from './carrito';
import { CarritoService } from '../servicios/carrito.service';
import { Plato } from '../entidades/plato';

describe('Carrito', () => {
  let component: Carrito;
  let fixture: ComponentFixture<Carrito>;
  let carritoService: CarritoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carrito],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Carrito);
    component = fixture.componentInstance;
    carritoService = TestBed.inject(CarritoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the empty cart message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Tu carrito está vacío');
  });

  it('should validate the client data before making an order', () => {
    component.realizarPedido();
    expect(component.error).toContain('Completa el nombre');
  });

  it('should require products in the cart to make an order', () => {
    component.cliente.nombre = 'Ana Pérez';
    component.cliente.celular = '3001234567';
    component.cliente.direccion = 'Calle 1 # 2-3';

    component.realizarPedido();
    expect(component.error).toContain('al menos un plato');
  });

  it('should merge duplicate products and calculate the totals', () => {
    const plato = new Plato();
    plato.id = '1';
    plato.nombre = 'Pasta';
    plato.precio = 20000;

    carritoService.agregar(plato);
    carritoService.agregar(plato);
    fixture.detectChanges();

    expect(carritoService.obtenerItems().length).toBe(1);
    expect(carritoService.obtenerItems()[0].cantidad).toBe(2);
    expect(carritoService.total()).toBe(40000);
  });

  it('should increase, decrease and remove the quantities', () => {
    const plato = new Plato();
    plato.id = '1';
    plato.nombre = 'Pasta';
    plato.precio = 20000;

    carritoService.agregar(plato);
    const item = carritoService.obtenerItems()[0];

    carritoService.aumentar(item);
    expect(item.cantidad).toBe(2);

    carritoService.disminuir(item);
    expect(item.cantidad).toBe(1);

    carritoService.disminuir(item);
    expect(item.cantidad).toBe(1);

    carritoService.eliminar(item);
    expect(carritoService.obtenerItems().length).toBe(0);
  });
});
