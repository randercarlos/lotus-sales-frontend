import { OrderDetail } from './order-detail.model';
export interface Order {
  id?: number;
  order_date: Date;
  order_details: OrderDetail[];
}
