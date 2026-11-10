import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Inicio } from './inicio';
import { ComidaService } from '../servicios/comida.service';
import { BebidaService } from '../servicios/bebida.service';
import { Plato } from '../entidades/plato';
import { Bebida } from '../entidades/bebida';

describe('Inicio', () => {
  let component: Inicio;
  let fixture: ComponentFixture<Inicio>;

  const esperar = () => new Promise(resolve => setTimeout(resolve, 0));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inicio],
      providers: [provideRouter([])],
    }).compileComponents();

    const plato = new Plato();
    plato.id = '1';
    plato.nombre = 'Pasta de la casa';
    plato.imagen = 'pasta.jpg';
    plato.precio = 25000;
    plato.ingredientes = ['Tomate', 'Albahaca'];

    const bebida = new Bebida();
    bebida.id = '2';
    bebida.nombre = 'Limonada';
    bebida.imagen = 'limonada.jpg';
    bebida.precio = 9000;
    bebida.ingredientes = ['Limón'];

    vi.spyOn(TestBed.inject(ComidaService), 'obtenerComidaAleatoria').mockResolvedValue(plato);
    vi.spyOn(TestBed.inject(BebidaService), 'obtenerBebidaAleatoria').mockResolvedValue(bebida);

    fixture = TestBed.createComponent(Inicio);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await esperar();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the featured dish and drink', () => {
    expect(component.platoDestacado?.nombre).toBe('Pasta de la casa');
    expect(component.bebidaDestacada?.nombre).toBe('Limonada');
  });

  it('should move through the gallery', () => {
    component.siguiente();
    expect(component.indice).toBe(1);

    component.anterior();
    expect(component.indice).toBe(0);
  });

  it('should return to the first image after the last one', () => {
    component.irA(component.imagenes.length - 1);
    component.siguiente();
    expect(component.indice).toBe(0);
  });
});
