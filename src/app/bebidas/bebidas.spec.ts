import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Bebidas } from './bebidas';
import { BebidaService } from '../servicios/bebida.service';
import { Bebida } from '../entidades/bebida';

describe('Bebidas', () => {
  let component: Bebidas;
  let fixture: ComponentFixture<Bebidas>;
  let bebidaService: BebidaService;

  const esperar = () => new Promise(resolve => setTimeout(resolve, 0));

  function crearBebida(id: string, nombre: string): Bebida {
    const bebida = new Bebida();
    bebida.id = id;
    bebida.nombre = nombre;
    bebida.imagen = nombre + '.jpg';
    bebida.precio = 12000;
    return bebida;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bebidas],
    }).compileComponents();

    bebidaService = TestBed.inject(BebidaService);

    vi.spyOn(bebidaService, 'listarPorAlcohol').mockResolvedValue([
      crearBebida('201', 'Margarita'),
      crearBebida('202', 'Mojito'),
    ]);

    fixture = TestBed.createComponent(Bebidas);
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

  it('should load the alcoholic drinks by default', () => {
    expect(component.filtroAlcohol).toBe('Alcoholic');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.tarjeta').length).toBe(2);
  });

  it('should filter drinks by category', async () => {
    vi.spyOn(bebidaService, 'listarPorCategoria').mockResolvedValue([
      crearBebida('201', 'Margarita'),
    ]);

    component.seleccionarCategoria('Cocktail');

    await esperar();
    fixture.detectChanges();

    expect(bebidaService.listarPorCategoria).toHaveBeenCalledWith('Cocktail');
    expect(component.filtroCategoria).toBe('Cocktail');
    expect(component.filtroAlcohol).toBe('');
    expect(component.bebidas.length).toBe(1);
  });

  it('should search drinks by ingredient', async () => {
    vi.spyOn(bebidaService, 'buscarPorIngrediente').mockResolvedValue([
      crearBebida('201', 'Margarita'),
    ]);

    component.busqueda = 'gin';
    component.tipoBusqueda = 'ingrediente';
    component.buscar();

    await esperar();
    fixture.detectChanges();

    expect(bebidaService.buscarPorIngrediente).toHaveBeenCalledWith('gin');
    expect(component.bebidas.length).toBe(1);
  });

  it('should load the drink detail with its ingredients', async () => {
    const detalle = crearBebida('201', 'Margarita');
    detalle.ingredientes = ['2 oz Tequila'];
    vi.spyOn(bebidaService, 'obtenerDetalle').mockResolvedValue(detalle);

    component.verDetalle(component.bebidas[0]);

    await esperar();

    expect(bebidaService.obtenerDetalle).toHaveBeenCalledWith('201');
    expect(component.detalle?.ingredientes).toEqual(['2 oz Tequila']);
  });

  it('should show the prices in COP', () => {
    expect(component.precioService.formatearPrecio(8000)).toBe('$ 8.000 COP');
  });
});
