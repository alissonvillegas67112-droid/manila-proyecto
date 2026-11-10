import { Plato } from './plato';
import { Bebida } from './bebida';

export type Producto = Plato | Bebida;

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}
