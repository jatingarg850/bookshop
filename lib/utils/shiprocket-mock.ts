/**
 * Mock Shiprocket responses for testing
 * Use this when Shiprocket account is not fully configured
 */

export const MOCK_SHIPPING_RATES = {
  rates: [
    {
      courier_company_id: 1,
      courier_name: 'Delhivery (Mock)',
      rate: 50,
      etd: '2-3',
    },
    {
      courier_company_id: 2,
      courier_name: 'Ecom Express (Mock)',
      rate: 60,
      etd: '3-4',
    },
    {
      courier_company_id: 3,
      courier_name: 'DTDC (Mock)',
      rate: 45,
      etd: '2-3',
    },
  ],
};

export const MOCK_ORDER_RESPONSE = {
  order_id: 123456,
  shipment_id: 789012,
  status_code: 200,
  status: 'success',
  message: 'Order created successfully (Mock)',
};

export const MOCK_SHIP_RESPONSE = {
  shipment_id: 789012,
  status_code: 200,
  status: 'success',
  awb_code: 'MOCK123456789',
  courier_name: 'Delhivery (Mock)',
  message: 'Order shipped successfully (Mock)',
};

export function isMockMode(): boolean {
  return process.env.SHIPROCKET_MOCK_MODE === 'true';
}
