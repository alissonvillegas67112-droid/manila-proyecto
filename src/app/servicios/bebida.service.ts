import { Injectable, inject } from '@angular/core';
import { Bebida } from '../entidades/bebida';
import { PrecioService } from './precio.service';

// Interfaces que describen la forma del JSON que devuelve la API.
interface BebidaResumen {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
}

interface BebidaApi extends BebidaResumen {
  [key: string]: string | null | undefined;
}

interface RespuestaBebidas {
  drinks: BebidaApi[] | null;
}

interface RespuestaResumen {
  drinks: BebidaResumen[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class BebidaService {

  private url = 'https://www.thecocktaildb.com/api/json/v1/1';
  private precioService = inject(PrecioService);

  // Lista las bebidas alcohólicas o sin alcohol.
  listarPorAlcohol(tipo: 'Alcoholic' | 'Non_Alcoholic'): Promise<Bebida[]> {
    return this.obtenerJson(
      this.url + '/filter.php?a=' + tipo
    ).then((data: RespuestaResumen) => {
      return (data.drinks ?? []).map(bebida => this.convertirBebidaBasica(bebida));
    });
  }

  // Lista las bebidas de una categoría (Ordinary Drink o Cocktail).
  listarPorCategoria(categoria: 'Ordinary_Drink' | 'Cocktail'): Promise<Bebida[]> {
    return this.obtenerJson(
      this.url + '/filter.php?c=' + categoria
    ).then((data: RespuestaResumen) => {
      return (data.drinks ?? []).map(bebida => this.convertirBebidaBasica(bebida));
    });
  }

  // Busca bebidas por nombre.
  buscarPorNombre(nombre: string): Promise<Bebida[]> {
    return this.obtenerJson(
      this.url + '/search.php?s=' + encodeURIComponent(nombre)
    ).then((data: RespuestaBebidas) => {
      return (data.drinks ?? []).map(bebida => this.convertirBebida(bebida));
    });
  }

  // Busca bebidas por ingrediente.
  buscarPorIngrediente(ingrediente: string): Promise<Bebida[]> {
    return this.obtenerJson(
      this.url + '/filter.php?i=' + encodeURIComponent(ingrediente)
    ).then((data: RespuestaResumen) => {
      return (data.drinks ?? []).map(bebida => this.convertirBebidaBasica(bebida));
    });
  }

  // Obtiene el detalle de una bebida por su id.
  obtenerDetalle(id: string): Promise<Bebida> {
    return this.obtenerJson(
      this.url + '/lookup.php?i=' + encodeURIComponent(id)
    ).then((data: RespuestaBebidas) => {
      const bebida = data.drinks?.[0];

      if (!bebida) {
        throw new Error('No se encontró la bebida');
      }

      return this.convertirBebida(bebida);
    });
  }

  // Obtiene una bebida aleatoria para la página de inicio.
  obtenerBebidaAleatoria(): Promise<Bebida> {
    return this.obtenerJson(this.url + '/random.php')
      .then((data: RespuestaBebidas) => {
        const bebida = data.drinks?.[0];

        if (!bebida) {
          throw new Error('No se encontró la bebida');
        }

        return this.convertirBebida(bebida);
      });
  }

  // Función central: hace la petición con fetch y convierte la respuesta a JSON.
  private obtenerJson(url: string): Promise<any> {
    return fetch(url)
      .then(response => response.json())
      .catch(error => {
        console.error('Error al consultar la API de bebidas:', error);
        throw error;
      });
  }

  // Convierte una bebida de la API en una Bebida de nuestra aplicación.
  private convertirBebidaBasica(bebida: BebidaResumen): Bebida {
    const nuevaBebida = new Bebida();
    nuevaBebida.id = bebida.idDrink;
    nuevaBebida.nombre = bebida.strDrink;
    nuevaBebida.imagen = bebida.strDrinkThumb;
    nuevaBebida.precio = this.precioService.obtenerPrecio(bebida.idDrink, 'bebida');
    return nuevaBebida;
  }

  // Convierte la bebida y además procesa sus ingredientes.
  private convertirBebida(bebida: BebidaApi): Bebida {
    const nuevaBebida = this.convertirBebidaBasica(bebida);
    nuevaBebida.ingredientes = this.obtenerIngredientes(bebida);
    return nuevaBebida;
  }

  // Recorre strIngredient1...15 y strMeasure1...15 omitiendo los vacíos.
  private obtenerIngredientes(bebida: BebidaApi): string[] {
    const ingredientes: string[] = [];

    for (let i = 1; i <= 15; i++) {
      const ingrediente = bebida['strIngredient' + i];
      const medida = bebida['strMeasure' + i];

      if (ingrediente && ingrediente.trim() !== '') {
        const texto = medida && medida.trim() !== ''
          ? medida.trim() + ' ' + ingrediente.trim()
          : ingrediente.trim();

        ingredientes.push(texto);
      }
    }

    return ingredientes;
  }

}
