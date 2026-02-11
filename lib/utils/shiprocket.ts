import axios, { AxiosInstance } from 'axios';

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

interface ShippingRateRequest {
  pickup_postcode: string;
  delivery_postcode: string;
  weight: number;
  cod: number;
}

interface ShippingRateResponse {
  rates: Array<{
    courier_company_id: number;
    courier_name: string;
    rate: number;
    etd: string;
  }>;
}

interface OrderCreateRequest {
  order_id: string;
  order_date: string;
  pickup_location_id: number;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_email: string;
  billing_phone: string;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_postcode: string;
  billing_country: string;
  shipping_is_billing: boolean;
  shipping_customer_name?: string;
  shipping_email?: string;
  shipping_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postcode?: string;
  shipping_country?: string;
  order_items: Array<{
    name: string;
    sku: string;
    units: number;
    selling_price: number;
    discount?: number;
    tax?: number;
    hsn_code?: string;
  }>;
  payment_method: 'Prepaid' | 'COD';
  sub_total: number;
  length?: number;
  breadth?: number;
  height?: number;
  weight: number;
}

interface OrderCreateResponse {
  order_id: number;
  shipment_id: number;
  status_code: number;
  status: string;
  message: string;
}

interface OrderShipRequest {
  shipment_id: number;
  courier_id: number;
}

interface OrderShipResponse {
  shipment_id: number;
  status_code: number;
  status: string;
  awb_code: string;
  courier_name: string;
  message: string;
}

interface PickupScheduleRequest {
  shipment_id: number;
  pickup_date: string;
}

interface PickupScheduleResponse {
  shipment_id: number;
  status_code: number;
  status: string;
  message: string;
}

interface TrackingResponse {
  tracking_data: {
    awb_code: string;
    order_id: string;
    shipment_status: string;
    shipment_status_id: number;
    current_status: string;
    current_status_id: number;
    scans: Array<{
      date: string;
      status: string;
      activity: string;
      location: string;
    }>;
  };
}

class ShiprocketClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: SHIPROCKET_API_BASE,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });
  }

  async authenticate(): Promise<void> {
    try {
      console.log('Authenticating with Shiprocket...');
      console.log('API Key length:', this.apiKey?.length);
      
      // Verify the token is valid by making a simple request
      await this.client.get('/settings/company/pickup');
      console.log('Shiprocket authentication successful');
    } catch (error: any) {
      console.error('Shiprocket authentication failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(`Shiprocket authentication failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async getShippingRates(request: ShippingRateRequest): Promise<ShippingRateResponse> {
    try {
      console.log('Fetching shipping rates with params:', request);
      const response = await this.client.get<ShippingRateResponse>('/courier/courierListWithRate', {
        params: request,
      });
      console.log('Shipping rates response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get shipping rates:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        params: error.config?.params,
      });
      throw error;
    }
  }

  async createOrder(request: OrderCreateRequest): Promise<OrderCreateResponse> {
    try {
      console.log('Creating order in Shiprocket with request:', JSON.stringify(request, null, 2));
      const response = await this.client.post<OrderCreateResponse>('/orders/create/adhoc', request);
      console.log('Order creation response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create order:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        request: error.config?.data,
      });
      throw error;
    }
  }

  async shipOrder(request: OrderShipRequest): Promise<OrderShipResponse> {
    try {
      const response = await this.client.post<OrderShipResponse>('/courier/assign/awb', request);
      return response.data;
    } catch (error) {
      console.error('Failed to ship order:', error);
      throw error;
    }
  }

  async schedulePickup(request: PickupScheduleRequest): Promise<PickupScheduleResponse> {
    try {
      const response = await this.client.post<PickupScheduleResponse>('/pickups/schedule', request);
      return response.data;
    } catch (error) {
      console.error('Failed to schedule pickup:', error);
      throw error;
    }
  }

  async trackOrder(awb: string): Promise<TrackingResponse> {
    try {
      const response = await this.client.get<TrackingResponse>(`/courier/track/awb/${awb}`);
      return response.data;
    } catch (error) {
      console.error('Failed to track order:', error);
      throw error;
    }
  }

  async generateLabel(shipmentId: number): Promise<string> {
    try {
      const response = await this.client.get(`/courier/generate/label`, {
        params: { shipment_id: shipmentId },
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data).toString('base64');
    } catch (error) {
      console.error('Failed to generate label:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: number): Promise<any> {
    try {
      const response = await this.client.post(`/orders/cancel`, {
        ids: [orderId],
      });
      return response.data;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  }
}

export async function getShiprocketClient(): Promise<ShiprocketClient> {
  const apiKey = process.env.SHIPROCKET_API_KEY;

  if (!apiKey) {
    throw new Error('Shiprocket API key not configured. Set SHIPROCKET_API_KEY in .env');
  }

  const client = new ShiprocketClient(apiKey);
  await client.authenticate();
  return client;
}

export type {
  ShippingRateRequest,
  ShippingRateResponse,
  OrderCreateRequest,
  OrderCreateResponse,
  OrderShipRequest,
  OrderShipResponse,
  PickupScheduleRequest,
  PickupScheduleResponse,
  TrackingResponse,
};
