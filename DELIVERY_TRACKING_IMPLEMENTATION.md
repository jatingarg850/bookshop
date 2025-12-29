# Delivery Tracking Implementation Guide

## Overview
The delivery tracking system displays real-time shipping information to both users and admins. It integrates with Shiprocket for tracking data and displays estimated delivery dates, current status, location, and delivery timeline.

## Features Implemented

### 1. User Order Detail Page (`app/account/orders/[id]/page.tsx`)
- **Delivery Status Card**: Displays comprehensive delivery information
- **Tracking Number**: Shows the AWB (Air Waybill) number in a monospace font
- **Status Badge**: Color-coded status indicator (green for delivered, blue for in-transit, etc.)
- **Carrier Information**: Shows the shipping carrier name
- **Estimated Delivery Date**: Displays when the package is expected to arrive
- **Actual Delivery Date**: Shows when the package was delivered (if applicable)
- **Current Location**: Displays the last known location of the package
- **Latest Update**: Shows the most recent status message from Shiprocket

### 2. Admin Order Detail Page (`app/admin/orders/[id]/page.tsx`)
- **Enhanced Delivery Status Card**: Same information as user page with admin-specific features
- **Update Tracking Button**: Allows admins to manually refresh tracking data from Shiprocket
- **Status Management**: Admins can see and manage the shipping workflow

### 3. API Endpoints

#### GET `/api/orders/[id]/delivery`
Fetches delivery information for a specific order.

**Authentication**: Required (user must own the order)

**Response**:
```json
{
  "delivery": {
    "_id": "...",
    "orderId": "...",
    "trackingNumber": "AWB123456",
    "carrier": "Shiprocket",
    "estimatedDeliveryDate": "2025-01-05T00:00:00Z",
    "actualDeliveryDate": "2025-01-04T00:00:00Z",
    "status": "delivered",
    "location": "Delhi",
    "notes": "Delivered",
    "shiprocketAWB": "AWB123456",
    "shiprocketOrderId": 12345,
    "shiprocketCourierId": 1
  }
}
```

#### GET `/api/shiprocket/track?awb=AWB123456`
Fetches tracking data from Shiprocket and updates the Delivery model.

**Response**:
```json
{
  "tracking": {
    "awb_code": "AWB123456",
    "order_id": "12345",
    "shipment_status": "DELIVERED",
    "current_status": "Delivered",
    "scans": [
      {
        "date": "2025-01-04T10:30:00Z",
        "status": "DELIVERED",
        "activity": "Delivered",
        "location": "Delhi"
      }
    ]
  },
  "updated": true
}
```

## Data Flow

### 1. Order Creation
When an order is created:
- Order is saved with shipping details
- Shiprocket order is created via `/api/shiprocket/orders/create`
- Delivery record is created with initial status

### 2. Shipping
When admin ships an order:
- Shiprocket assigns a courier and generates AWB
- Delivery record is updated with tracking number and estimated delivery date
- Order status changes to "shipped"

### 3. Tracking Updates
Tracking data is updated in two ways:

**Automatic**: 
- Shiprocket webhook (if configured) updates delivery status

**Manual**:
- Admin clicks "Update Tracking" button
- System fetches latest data from Shiprocket
- Delivery model is updated with new status, location, and notes

### 4. Display
- User sees delivery info on their order detail page
- Admin sees delivery info on admin order detail page
- Both can see real-time updates

## Status Mapping

Shiprocket statuses are mapped to internal statuses:

| Shiprocket Status | Internal Status | Badge Color |
|---|---|---|
| MANIFEST GENERATED | pending | Gray |
| PICKED UP | picked_up | Yellow |
| IN TRANSIT | in_transit | Blue |
| OUT FOR DELIVERY | out_for_delivery | Blue |
| DELIVERED | delivered | Green |
| FAILED | failed | Red |

## UI Components

### Status Badge
```tsx
<span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusBadgeColor(delivery.status)}`}>
  {formatStatus(delivery.status)}
</span>
```

### Delivery Information Grid
```tsx
<div className="grid grid-cols-2 gap-4">
  <div>
    <p className="text-sm text-gray-600">Carrier</p>
    <p className="font-semibold">{delivery.carrier}</p>
  </div>
  <div>
    <p className="text-sm text-gray-600">Est. Delivery</p>
    <p className="font-semibold">
      {new Date(delivery.estimatedDeliveryDate).toLocaleDateString()}
    </p>
  </div>
</div>
```

## Helper Functions

### `getStatusBadgeColor(status: string): string`
Returns Tailwind CSS classes for status badge styling based on delivery status.

### `formatStatus(status: string): string`
Converts snake_case status to Title Case (e.g., "out_for_delivery" → "Out For Delivery").

## Integration Points

### With Shiprocket
- Fetches tracking data via `/api/shiprocket/track`
- Updates Delivery model with latest information
- Handles status mapping and location updates

### With Order Model
- Delivery is linked to Order via `orderId`
- Order contains Shiprocket-specific fields:
  - `shiprocketOrderId`: Shiprocket order ID
  - `shiprocketAWB`: Air Waybill number
  - `shiprocketCourier`: Courier name

### With User Authentication
- User can only see their own order's delivery info
- Admin can see all orders' delivery info

## Public Tracking Page

The public tracking page (`app/order-tracking/page.tsx`) allows anyone to track an order by entering the AWB number. It displays:
- Shipment status summary
- Tracking timeline with scans
- Current location and last update time

## Future Enhancements

1. **Webhook Integration**: Automatically update delivery status when Shiprocket sends webhooks
2. **Email Notifications**: Send users email updates when delivery status changes
3. **SMS Notifications**: Send SMS updates for key milestones (picked up, out for delivery, delivered)
4. **Delivery Timeline Component**: Visual timeline showing all tracking scans
5. **Proof of Delivery**: Display photos/signatures from delivery
6. **Delivery Preferences**: Allow users to set delivery instructions or reschedule delivery
7. **Multiple Tracking**: Track multiple packages in a single order

## Testing

To test the delivery tracking:

1. Create an order and complete payment
2. Admin ships the order (selects courier)
3. Shiprocket generates AWB and creates shipment
4. Delivery record is created with estimated delivery date
5. User can see delivery info on their order detail page
6. Admin can click "Update Tracking" to refresh status
7. Public tracking page can be accessed with AWB number

## Troubleshooting

### Delivery info not showing
- Verify Delivery record exists in database
- Check that order has been shipped (has shiprocketAWB)
- Verify user is authenticated and owns the order

### Tracking not updating
- Check Shiprocket API credentials
- Verify AWB number is correct
- Check Shiprocket API response for errors
- Review server logs for API errors

### Status not mapping correctly
- Verify status mapping in `/api/shiprocket/track/route.ts`
- Check Shiprocket API response format
- Update status mapping if Shiprocket changes status values
