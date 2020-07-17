import { Category } from '../categories/category.model';

export interface Product {
  id: number;
  name: string;
  category: Category;
  costPrice: number;
  salePrice: number;
  unitsStock: number;
  photo: string;
  active: boolean;
}
