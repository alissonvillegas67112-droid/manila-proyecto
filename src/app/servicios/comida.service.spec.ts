import { TestBed } from '@angular/core/testing';
import { ComidaService } from './comida.service';

describe('ComidaService', () => {
  let service: ComidaService;
  let fetchMock: any;

  function respuestaJson(data: unknown): Promise<any> {
    return Promise.resolve({
      json: () => Promise.resolve(data),
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComidaService);

    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should load the categories with fetch', async () => {
    fetchMock.mockReturnValue(respuestaJson({
      categories: [
        { strCategory: 'Beef' },
        { strCategory: 'Chicken' },
      ],
    }));

    const categorias = await service.obtenerCategorias();

    expect(fetchMock).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/categories.php');
    expect(categorias).toEqual(['Beef', 'Chicken']);
  });

  it('should search dishes by name and process the ingredients', async () => {
    fetchMock.mockReturnValue(respuestaJson({
      meals: [{
        idMeal: '1',
        strMeal: 'Pollo al horno',
        strMealThumb: 'pollo.jpg',
        strIngredient1: 'Pollo',
        strMeasure1: '1 kg',
        strIngredient2: '',
        strMeasure2: '',
        strIngredient3: 'Sal',
        strMeasure3: '1 cda',
      }],
    }));

    const platos = await service.buscarPorNombre('pollo');

    expect(fetchMock).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=pollo');
    expect(platos.length).toBe(1);
    expect(platos[0].nombre).toBe('Pollo al horno');
    expect(platos[0].ingredientes).toEqual(['1 kg Pollo', '1 cda Sal']);
  });

  it('should keep the same price for the same product', async () => {
    fetchMock.mockReturnValue(respuestaJson({
      meals: [{
        idMeal: '1',
        strMeal: 'Pollo al horno',
        strMealThumb: 'pollo.jpg',
      }],
    }));

    const primera = await service.buscarPorNombre('pollo');
    const segunda = await service.buscarPorNombre('pollo');

    expect(primera[0].precio).toBe(segunda[0].precio);
  });

  it('should throw an error when the dish does not exist', async () => {
    fetchMock.mockReturnValue(respuestaJson({ meals: null }));

    await expect(service.obtenerDetalle('999')).rejects.toThrow('No se encontró la comida');
  });
});
