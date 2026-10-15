import { frappeRequest } from '../../../services/frappe/client';

const base = '/api/method/realtime_marketplace.api.orders';

export function loadMarketplace() {
  return Promise.all([
    frappeRequest(`${base}.get_dashboard_context`),
    frappeRequest(`${base}.get_active_products`),
    frappeRequest(`${base}.get_buyer_orders`),
    frappeRequest(`${base}.get_seller_orders`),
  ]).then(([context, products, buyerOrders, sellerOrders]) => ({
    context,
    products: products || [],
    buyerOrders: buyerOrders || [],
    sellerOrders: sellerOrders || [],
  }));
}

export function placeOrder(product, quantity) {
  return frappeRequest(`${base}.place_order`, {
    method: 'POST',
    body: { product, quantity },
  });
}

export function updateOrderStatus(order_name, status) {
  return frappeRequest(`${base}.update_order_status`, {
    method: 'POST',
    body: { order_name, status },
  });
}
