import { Injectable, inject } from '@angular/core';
import { Plato } from '../entidades/plato';
import { PrecioService } from './precio.service';

// Interfaces que describen la forma del JSON que devuelve la API.
interface CategoriaApi {
  strCategory: string;
}

interface RespuestaCategorias {
  categories: CategoriaApi[];
}

interface ComidaResumen {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface ComidaApi extends ComidaResumen {
  [key: string]: string | null | undefined;
}

interface RespuestaComidas {
  meals: ComidaApi[] | null;
}

interface RespuestaResumen {
  meals: ComidaResumen[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class ComidaService {

  private url = 'https://www.themealdb.com/api/json/v1/1';
  private precioService = inject(PrecioService);

  // Obtiene la lista de categorías.
  obtenerCategorias(): Promise<string[]> {
    return this.obtenerJson(this.url + '/categories.php')
      .then((data: RespuestaCategorias) => {
        return (data.categories ?? []).map(categoria => categoria.strCategory);
      });
  }

  // Obtiene las comidas de una categoría.
  obtenerComidasPorCategoria(categoria: string): Promise<Plato[]> {
    return this.obtenerJson(
      this.url + '/filter.php?c=' + encodeURIComponent(categoria)
    ).then((data: RespuestaResumen) => {
      return (data.meals ?? []).map(comida => this.convertirPlatoBasico(comida));
    });
  }

  // Busca comidas por nombre.
  buscarPorNombre(nombre: string): Promise<Plato[]> {
    return this.obtenerJson(
      this.url + '/search.php?s=' + encodeURIComponent(nombre)
    ).then((data: RespuestaComidas) => {
      return (data.meals ?? []).map(comida => this.convertirPlato(comida));
    });
  }

  // Busca comidas por ingrediente.
  buscarPorIngrediente(ingrediente: string): Promise<Plato[]> {
    return this.obtenerJson(
      this.url + '/filter.php?i=' + encodeURIComponent(ingrediente)
    ).then((data: RespuestaResumen) => {
      return (data.meals ?? []).map(comida => this.convertirPlatoBasico(comida));
    });
  }

  // Obtiene el detalle de una comida por su id.
  obtenerDetalle(id: string): Promise<Plato> {
    return this.obtenerJson(
      this.url + '/lookup.php?i=' + encodeURIComponent(id)
    ).then((data: RespuestaComidas) => {
      const comida = data.meals?.[0];

      if (!comida) {
        throw new Error('No se encontró la comida');
      }

      return this.convertirPlato(comida);
    });
  }

  // Obtiene una comida aleatoria para la página de inicio.
  obtenerComidaAleatoria(): Promise<Plato> {
    return this.obtenerJson(this.url + '/random.php')
      .then((data: RespuestaComidas) => {
        const comida = data.meals?.[0];

        if (!comida) {
          throw new Error('No se encontró la comida');
        }

        return this.convertirPlato(comida);
      });
  }

  // Función central: hace la petición con fetch y convierte la respuesta a JSON.
  private obtenerJson(url: string): Promise<any> {
    return fetch(url)
      .then(response => response.json())
      .catch(error => {
        console.error('Error al consultar la API de comidas:', error);
        throw error;
      });
  }

  // Convierte una comida de la API en un Plato de nuestra aplicación.
  private convertirPlatoBasico(comida: ComidaResumen): Plato {
    const plato = new Plato();
    plato.id = comida.idMeal;
    plato.nombre = comida.strMeal;
    plato.imagen = comida.strMealThumb;
    plato.precio = this.precioService.obtenerPrecio(comida.idMeal, 'comida');
    return plato;
  }

  // Convierte la comida y además procesa sus ingredientes.
  private convertirPlato(comida: ComidaApi): Plato {
    const plato = this.convertirPlatoBasico(comida);
    plato.ingredientes = this.obtenerIngredientes(comida);
    return plato;
  }

  // Recorre strIngredient1...20 y strMeasure1...20 omitiendo los vacíos.
  private obtenerIngredientes(comida: ComidaApi): string[] {
    const ingredientes: string[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingrediente = comida['strIngredient' + i];
      const medida = comida['strMeasure' + i];

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
