import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { ComidaService } from './servicios/comida.service';
import { BebidaService } from './servicios/bebida.service';
import { Plato } from './entidades/plato';
import { Bebida } from './entidades/bebida';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    })
      .compileComponents();

    vi.spyOn(TestBed.inject(ComidaService), 'obtenerComidaAleatoria').mockResolvedValue(new Plato());
    vi.spyOn(TestBed.inject(BebidaService), 'obtenerBebidaAleatoria').mockResolvedValue(new Bebida());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the restaurant name', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.marca')?.textContent).toContain('MANILA');
  });
});
