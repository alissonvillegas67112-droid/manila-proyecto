import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Platos } from './platos';
import { ComidaService } from '../servicios/comida.service';
import { PrecioService } from '../servicios/precio.service';
import { Plato } from '../entidades/plato';

describe('Platos', () => {
  let component: Platos;
  let fixture: ComponentFixture<Platos>;
  let comidaService: ComidaService;

  const esperar = () => new Promise(resolve => setTimeout(resolve, 0));

  function crearPlato(id: string, nombre: string): Plato {
    const plato = new Plato();
    plato.id = id;
    plato.nombre = nombre;
    plato.imagen = nombre + '.jpg';
    plato.precio = 20000;
    return plato;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Platos],
    }).compileComponents();

    comidaService = TestBed.inject(ComidaService);

    vi.spyOn(comidaService, 'obtenerCategorias').mockResolvedValue(['Beef', 'Chicken']);
    vi.spyOn(comidaService, 'obtenerComidasPorCategoria').mockResolvedValue([
      crearPlato('101', 'Bife de chorizo'),
      crearPlato('102', 'Pollo al horno'),
    ]);

    fixture = TestBed.createComponent(Platos);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await esperar();
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the categories and the dishes of the first one', () => {
    expect(component.categorias.length).toBe(2);
    expect(component.categoriaSeleccionada).toBe('Beef');

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.tarjeta').length).toBe(2);
  });

  it('should search dishes by name', async () => {
    const plato = crearPlato('102', 'Pollo al horno');
    plato.ingredientes = ['1 kg Pollo', '1 cda Sal'];
    vi.spyOn(comidaService, 'buscarPorNombre').mockResolvedValue([plato]);

    component.busqueda = 'pollo';
    component.tipoBusqueda = 'nombre';
    component.buscar();

    await esperar();
    fixture.detectChanges();

    expect(comidaService.buscarPorNombre).toHaveBeenCalledWith('pollo');
    expect(component.platos.length).toBe(1);
    expect(component.platos[0].ingredientes).toEqual(['1 kg Pollo', '1 cda Sal']);
  });

  it('should search dishes by ingredient', async () => {
    vi.spyOn(comidaService, 'buscarPorIngrediente').mockResolvedValue([
      crearPlato('101', 'Bife de chorizo'),
      crearPlato('102', 'Pollo al horno'),
    ]);

    component.busqueda = 'tomate';
    component.tipoBusqueda = 'ingrediente';
    component.buscar();

    await esperar();
    fixture.detectChanges();

    expect(comidaService.buscarPorIngrediente).toHaveBeenCalledWith('tomate');
    expect(component.platos.length).toBe(2);
  });

  it('should load the detail of a dish', async () => {
    const detalle = crearPlato('101', 'Bife de chorizo');
    detalle.ingredientes = ['1 kg Carne', '1 cda Sal'];
    vi.spyOn(comidaService, 'obtenerDetalle').mockResolvedValue(detalle);

    component.verDetalle(component.platos[0]);

    await esperar();

    expect(comidaService.obtenerDetalle).toHaveBeenCalledWith('101');
    expect(component.detalle).toBe(detalle);
    expect(component.detalle?.ingredientes.length).toBe(2);
  });

  it('should keep the price stable for the same product', () => {
    const precioService = TestBed.inject(PrecioService);
    const primero = precioService.obtenerPrecio('101', 'comida');
    const segundo = precioService.obtenerPrecio('101', 'comida');

    expect(primero).toBe(segundo);
    expect(precioService.formatearPrecio(15000)).toBe('$ 15.000 COP');
  });
});
