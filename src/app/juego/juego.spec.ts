import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Juego } from './juego';

describe('Juego', () => {
  let component: Juego;
  let fixture: ComponentFixture<Juego>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Juego],
    }).compileComponents();

    fixture = TestBed.createComponent(Juego);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a 4 x 4 board', () => {
    expect(component.casillas.length).toBe(16);
  });

  it('should place one dish and one drink when playing', () => {
    component.jugar();

    const comidas = component.casillas.filter(casilla => casilla.tipo === 'comida');
    const bebidas = component.casillas.filter(casilla => casilla.tipo === 'bebida');

    expect(comidas.length).toBe(1);
    expect(bebidas.length).toBe(1);
    expect(comidas[0].id).not.toBe(bebidas[0].id);
    expect(component.juegoActivo).toBe(true);
  });

  it('should show a message when the player clicks an empty cell', () => {
    component.jugar();

    const casillaVacia = component.casillas.find(casilla => casilla.tipo === null)!;
    component.descubrir(casillaVacia);

    expect(component.mensaje).toContain('Intenta de nuevo');
    expect(casillaVacia.descubierta).toBe(false);
  });

  it('should reveal the dish and the drink and restart with new positions', () => {
    vi.useFakeTimers();

    component.jugar();

    const comida = component.casillas.find(casilla => casilla.tipo === 'comida')!;
    const bebida = component.casillas.find(casilla => casilla.tipo === 'bebida')!;

    component.descubrir(comida);
    expect(comida.descubierta).toBe(true);
    expect(component.juegoTerminado).toBe(false);

    component.descubrir(bebida);
    expect(bebida.descubierta).toBe(true);
    expect(component.juegoTerminado).toBe(true);

    vi.advanceTimersByTime(2500);

    expect(component.juegoTerminado).toBe(false);
    expect(component.comidaEncontrada).toBe(false);
    expect(component.bebidaEncontrada).toBe(false);
    expect(component.casillas.filter(casilla => casilla.tipo === 'comida').length).toBe(1);
    expect(component.casillas.filter(casilla => casilla.tipo === 'bebida').length).toBe(1);
  });
});
