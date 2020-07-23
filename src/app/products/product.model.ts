import { Category } from '../categories/category.model';

export interface Product {
  id: number;
  name: string;
  category: Category;
  cost_price: number;
  sale_price: number;
  units_stock: number;
  photo: string;
  active: boolean;
}
