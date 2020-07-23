import { Product } from './../products/product.model';
import { Order } from './order.model';
export interface OrderDetail {
  id?: number;
  order?: Order;
  product: Product;
  unit_price: number;
  qtd: number;
}
