import { TestBed } from '@angular/core/testing';
import { BebidaService } from './bebida.service';

describe('BebidaService', () => {
  let service: BebidaService;
  let fetchMock: any;

  function respuestaJson(data: unknown): Promise<any> {
    return Promise.resolve({
      json: () => Promise.resolve(data),
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BebidaService);

    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should list drinks by alcohol type with fetch', async () => {
    fetchMock.mockReturnValue(respuestaJson({
      drinks: [
        { idDrink: '1', strDrink: 'Margarita', strDrinkThumb: 'margarita.jpg' },
      ],
    }));

    const bebidas = await service.listarPorAlcohol('Alcoholic');

    expect(fetchMock).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic');
    expect(bebidas.length).toBe(1);
    expect(bebidas[0].nombre).toBe('Margarita');
  });

  it('should search drinks by name and process the ingredients', async () => {
    fetchMock.mockReturnValue(respuestaJson({
      drinks: [{
        idDrink: '1',
        strDrink: 'Margarita',
        strDrinkThumb: 'margarita.jpg',
        strIngredient1: 'Tequila',
        strMeasure1: '2 oz',
        strIngredient2: '',
        strMeasure2: '',
      }],
    }));

    const bebidas = await service.buscarPorNombre('margarita');

    expect(fetchMock).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita');
    expect(bebidas[0].ingredientes).toEqual(['2 oz Tequila']);
  });

  it('should keep the same price for the same product', async () => {
    fetchMock.mockReturnValue(respuestaJson({
      drinks: [
        { idDrink: '1', strDrink: 'Margarita', strDrinkThumb: 'margarita.jpg' },
      ],
    }));

    const primera = await service.listarPorAlcohol('Alcoholic');
    const segunda = await service.listarPorAlcohol('Alcoholic');

    expect(primera[0].precio).toBe(segunda[0].precio);
  });

  it('should throw an error when the drink does not exist', async () => {
    fetchMock.mockReturnValue(respuestaJson({ drinks: null }));

    await expect(service.obtenerDetalle('999')).rejects.toThrow('No se encontró la bebida');
  });
});
