# Shiprocket Integration Guide

This guide explains how to integrate Shiprocket shipping and delivery management with your Radhe Stationery e-commerce platform.

## Overview

The Shiprocket integration enables:
- Real-time shipping rate calculation
- Automated order creation in Shiprocket
- Courier assignment and AWB generation
- Live order tracking
- Delivery status updates
- Admin dashboard for order management

## Setup Instructions

### 1. Create Shiprocket Account

1. Visit [Shiprocket](https://www.shiprocket.in)
2. Sign up for a business account
3. Complete KYC verification
4. Add your pickup location (warehouse address)

### 2. Create API User

1. Log in to Shiprocket dashboard
2. Go to **Settings → API → Add New API User**
3. Click **Create API User**
4. Fill in the form:
   - Email: Use a different email than your main account
   - Modules to Access: Select all relevant modules
   - Buyer's Details Access: Choose "Allowed"
5. Click **Create User**
6. Password will be sent to the registered email

### 3. Configure Environment Variables

Update your `.env` file with Shiprocket credentials:

```env
# Shiprocket Integration
SHIPROCKET_EMAIL=your-shiprocket-api-email@example.com
SHIPROCKET_PASSWORD=your-shiprocket-api-password
SHIPROCKET_PICKUP_LOCATION_ID=1
NEXT_PUBLIC_STORE_PINCODE=110001
```

**Where to find these:**
- **SHIPROCKET_EMAIL**: Email used for API user creation
- **SHIPROCKET_PASSWORD**: Password sent to your email
- **SHIPROCKET_PICKUP_LOCATION_ID**: Found in Settings → Pickup Locations
- **NEXT_PUBLIC_STORE_PINCODE**: Your warehouse/store pincode

### 4. Database Schema Updates

The following fields have been added to track Shiprocket data:

**Order Model:**
- `shiprocketOrderId`: Shiprocket order ID
- `shiprocketShipmentId`: Shiprocket shipment ID
- `shiprocketAWB`: Air Waybill number
- `shiprocketCourier`: Courier company name

**Delivery Model:**
- `shiprocketAWB`: Air Waybill number
- `shiprocketOrderId`: Shiprocket order ID
- `shiprocketCourierId`: Courier company ID

## Features

### 1. Shipping Rate Calculation

**Endpoint:** `POST /api/shiprocket/shipping-rates`

Get available couriers and rates for a shipment:

```javascript
const response = await fetch('/api/shiprocket/shipping-rates', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pickup_postcode: '110001',
    delivery_postcode: '560001',
    weight: 1.5,
    cod: 1, // 1 for COD, 0 for prepaid
  }),
});
```

**Response:**
```json
{
  "rates": [
    {
      "courier_company_id": 1,
      "courier_name": "Delhivery",
      "rate": 85,
      "etd": "2"
    }
  ]
}
```

### 2. Create Order in Shiprocket

**Endpoint:** `POST /api/shiprocket/orders/create`

Create an order in Shiprocket system:

```javascript
const response = await fetch('/api/shiprocket/orders/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: '507f1f77bcf86cd799439011',
  }),
});
```

**Response:**
```json
{
  "success": true,
  "shiprocketOrderId": 123456,
  "shipmentId": 789012,
  "message": "Order created in Shiprocket successfully"
}
```

### 3. Ship Order (Assign Courier)

**Endpoint:** `POST /api/shiprocket/orders/ship`

Assign a courier and generate AWB:

```javascript
const response = await fetch('/api/shiprocket/orders/ship', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: '507f1f77bcf86cd799439011',
    courierId: 1, // From shipping rates response
  }),
});
```

**Response:**
```json
{
  "success": true,
  "awb": "DLV987654321",
  "courier": "Delhivery",
  "message": "Order shipped successfully"
}
```

### 4. Track Order

**Endpoint:** `GET /api/shiprocket/track?awb=DLV987654321`

Get real-time tracking information:

```javascript
const response = await fetch('/api/shiprocket/track?awb=DLV987654321');
const data = await response.json();
```

**Response:**
```json
{
  "tracking": {
    "awb_code": "DLV987654321",
    "order_id": "507f1f77bcf86cd799439011",
    "shipment_status": "IN TRANSIT",
    "current_status": "Shipment in transit",
    "scans": [
      {
        "date": "2024-01-15 10:30:00",
        "status": "PICKED UP",
        "activity": "Shipment picked up",
        "location": "Delhi"
      }
    ]
  }
}
```

## Admin Dashboard

### Order Management

**Path:** `/admin/orders`

Features:
- View all orders with status filtering
- Pagination support
- Quick view of order details

### Order Details

**Path:** `/admin/orders/[id]`

Features:
- View complete order information
- See shipping address
- Get real-time shipping rates
- Select courier and ship order
- View delivery status
- Update tracking information

### Delivery Management

**Path:** `/admin/delivery`

Features:
- View all deliveries
- Filter by status
- Track shipments
- Update delivery information

## Customer Features

### Order Tracking

**Path:** `/order-tracking`

Customers can:
- Enter tracking number (AWB)
- View shipment status
- See tracking timeline
- Get location updates

## Workflow

### Complete Order Shipping Workflow

1. **Order Confirmation**
   - Customer places order
   - Payment is processed
   - Order status: `confirmed`

2. **Create in Shiprocket**
   - Admin clicks "Ship Order"
   - System creates order in Shiprocket
   - Shipment ID is generated

3. **Select Courier**
   - System fetches available couriers
   - Admin selects preferred courier
   - System assigns courier

4. **AWB Generation**
   - Shiprocket generates AWB
   - Order status: `shipped`
   - Delivery record created

5. **Tracking Updates**
   - Shiprocket sends tracking updates
   - Delivery status updated automatically
   - Customer can track order

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid credentials | Wrong email/password | Verify Shiprocket API credentials |
| Pickup location not found | Invalid location ID | Check SHIPROCKET_PICKUP_LOCATION_ID |
| No rates available | Unsupported route | Check pincode validity |
| Order already shipped | Duplicate shipping attempt | Check order status |

## Testing

### Test Credentials

Use Shiprocket's test environment:
- Email: `test@shiprocket.in`
- Password: `test123`

### Test Pincodes

- Pickup: `110001` (Delhi)
- Delivery: `560001` (Bangalore)

## Webhooks (Optional)

Set up webhooks for automatic tracking updates:

1. Go to Shiprocket Settings → API → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/shiprocket`
3. Enable toggle
4. Add security token (optional)

Webhook will send POST requests with tracking updates.

## Best Practices

1. **Weight Calculation**
   - Accurately calculate package weight
   - Include packaging material weight
   - Use consistent units (kg)

2. **Address Validation**
   - Ensure complete address information
   - Verify pincode format (6 digits)
   - Use standardized state codes

3. **Timing**
   - Ship orders within 24 hours
   - Schedule pickups in advance
   - Monitor delivery status regularly

4. **Error Handling**
   - Implement retry logic
   - Log all API calls
   - Alert on failures

## Support

For issues:
- **Shiprocket Support**: support@shiprocket.in
- **Integration Support**: integration@shiprocket.com
- **Documentation**: https://apidocs.shiprocket.in

## API Reference

### Shiprocket API Endpoints

- **Authentication**: `POST /auth/login`
- **Shipping Rates**: `GET /courier/courierListWithRate`
- **Create Order**: `POST /orders/create/adhoc`
- **Assign Courier**: `POST /courier/assign/awb`
- **Track Order**: `GET /courier/track/awb/{awb}`
- **Schedule Pickup**: `POST /pickups/schedule`
- **Generate Label**: `GET /courier/generate/label`
- **Cancel Order**: `POST /orders/cancel`

## Troubleshooting

### Orders not appearing in Shiprocket

1. Check API credentials
2. Verify pickup location ID
3. Ensure order has valid shipping address
4. Check network connectivity

### Tracking not updating

1. Verify AWB number
2. Check courier status
3. Wait for courier to scan package
4. Manually refresh tracking

### Rate calculation errors

1. Verify pincodes are valid
2. Check weight calculation
3. Ensure COD flag is correct
4. Verify pickup location

## Next Steps

1. Configure Shiprocket credentials in `.env`
2. Test shipping rate calculation
3. Create test order and ship
4. Verify tracking updates
5. Set up webhooks for automation
6. Train admin team on order management
