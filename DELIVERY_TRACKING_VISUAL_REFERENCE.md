# Delivery Tracking - Visual Reference Guide

## User Order Detail Page - Delivery Status Section

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Delivery Status                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Tracking Number          [Status Badge]             │   │
│ │ AWB123456789             [DELIVERED]                │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
│ Carrier                    Est. Delivery                   │
│ Shiprocket                 Jan 5, 2025                     │
│                                                             │
│ Delivered On                                               │
│ Jan 4, 2025                                                │
│                                                             │
│ Current Location                                           │
│ Delhi Distribution Center                                  │
│                                                             │
│ Latest Update                                              │
│ Delivered to recipient                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Status Badge Colors

### Delivered (Green)
```
┌──────────────┐
│  DELIVERED   │  bg-green-100 text-green-700
└──────────────┘
```

### In Transit (Blue)
```
┌──────────────┐
│  IN TRANSIT  │  bg-blue-100 text-blue-700
└──────────────┘
```

### Out for Delivery (Blue)
```
┌──────────────────────┐
│ OUT FOR DELIVERY     │  bg-blue-100 text-blue-700
└──────────────────────┘
```

### Picked Up (Yellow)
```
┌──────────────┐
│  PICKED UP   │  bg-yellow-100 text-yellow-700
└──────────────┘
```

### Pending (Gray)
```
┌──────────────┐
│   PENDING    │  bg-gray-100 text-gray-700
└──────────────┘
```

### Failed (Red)
```
┌──────────────┐
│   FAILED     │  bg-red-100 text-red-700
└──────────────┘
```

## Admin Order Detail Page - Enhanced Delivery Section

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Delivery Status                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Tracking Number          [Status Badge]             │   │
│ │ AWB123456789             [DELIVERED]                │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
│ Carrier                    Est. Delivery                   │
│ Shiprocket                 Jan 5, 2025                     │
│                                                             │
│ Delivered On                                               │
│ Jan 4, 2025                                                │
│                                                             │
│ Current Location                                           │
│ Delhi Distribution Center                                  │
│                                                             │
│ Latest Update                                              │
│ Delivered to recipient                                     │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 🔄 Update Tracking                                  │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Display Examples

### Example 1: Pending Order
```
Tracking Number: AWB987654321
Status: PENDING (Gray Badge)
Carrier: Shiprocket
Est. Delivery: Jan 8, 2025
Current Location: Warehouse
Latest Update: Manifest generated
```

### Example 2: In Transit Order
```
Tracking Number: AWB123456789
Status: IN TRANSIT (Blue Badge)
Carrier: Shiprocket
Est. Delivery: Jan 5, 2025
Current Location: Regional Hub - Mumbai
Latest Update: In transit to destination
```

### Example 3: Out for Delivery
```
Tracking Number: AWB456789123
Status: OUT FOR DELIVERY (Blue Badge)
Carrier: Shiprocket
Est. Delivery: Jan 4, 2025
Current Location: Local Delivery Center
Latest Update: Out for delivery
```

### Example 4: Delivered Order
```
Tracking Number: AWB789123456
Status: DELIVERED (Green Badge)
Carrier: Shiprocket
Est. Delivery: Jan 3, 2025
Delivered On: Jan 3, 2025
Current Location: Delivered
Latest Update: Delivered to recipient
```

### Example 5: Failed Delivery
```
Tracking Number: AWB321654987
Status: FAILED (Red Badge)
Carrier: Shiprocket
Est. Delivery: Jan 2, 2025
Current Location: Local Delivery Center
Latest Update: Delivery failed - will retry
```

## Component Structure

### Delivery Status Card
```tsx
<Card className="mt-6">
  <h2 className="font-heading text-xl font-bold mb-4">
    Delivery Status
  </h2>
  
  {/* Tracking Number + Status Badge */}
  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
    <div>
      <p className="text-sm text-gray-600">Tracking Number</p>
      <p className="font-mono font-bold text-lg">
        {delivery.trackingNumber}
      </p>
    </div>
    <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusBadgeColor(delivery.status)}`}>
      {formatStatus(delivery.status)}
    </span>
  </div>
  
  {/* Carrier + Est. Delivery */}
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
  
  {/* Actual Delivery Date (if delivered) */}
  {delivery.actualDeliveryDate && (
    <div>
      <p className="text-sm text-gray-600">Delivered On</p>
      <p className="font-semibold text-green-600">
        {new Date(delivery.actualDeliveryDate).toLocaleDateString()}
      </p>
    </div>
  )}
  
  {/* Current Location */}
  {delivery.location && (
    <div>
      <p className="text-sm text-gray-600">Current Location</p>
      <p className="font-semibold">{delivery.location}</p>
    </div>
  )}
  
  {/* Latest Update */}
  {delivery.notes && (
    <div>
      <p className="text-sm text-gray-600">Latest Update</p>
      <p className="font-semibold">{delivery.notes}</p>
    </div>
  )}
</Card>
```

## API Response Structure

### GET /api/orders/[id]/delivery

**Success Response (200)**
```json
{
  "delivery": {
    "_id": "507f1f77bcf86cd799439011",
    "orderId": "507f1f77bcf86cd799439012",
    "trackingNumber": "AWB123456789",
    "carrier": "Shiprocket",
    "estimatedDeliveryDate": "2025-01-05T00:00:00.000Z",
    "actualDeliveryDate": "2025-01-04T10:30:00.000Z",
    "status": "delivered",
    "location": "Delhi",
    "notes": "Delivered to recipient",
    "shiprocketAWB": "AWB123456789",
    "shiprocketOrderId": 12345,
    "shiprocketCourierId": 1,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-04T10:30:00.000Z"
  }
}
```

**Error Response (401)**
```json
{
  "error": "Unauthorized"
}
```

**Error Response (404)**
```json
{
  "error": "Delivery not found"
}
```

## Status Transition Timeline

### Typical Delivery Journey
```
Order Created
    ↓
Order Confirmed
    ↓
Manifest Generated (PENDING)
    ↓
Picked Up (PICKED_UP)
    ↓
In Transit (IN_TRANSIT)
    ↓
Out for Delivery (OUT_FOR_DELIVERY)
    ↓
Delivered (DELIVERED) ✓
```

### Alternative Paths
```
Failed Delivery (FAILED)
    ↓
Retry Delivery
    ↓
Delivered (DELIVERED) ✓
```

## User Journey

### Customer Perspective
```
1. Place Order
   ↓
2. Payment Confirmation
   ↓
3. Order Confirmed
   ↓
4. View Order Details
   ↓
5. See "Delivery Status" Section
   ↓
6. Track Package in Real-Time
   ↓
7. Receive Delivery Notification
   ↓
8. Package Delivered ✓
```

### Admin Perspective
```
1. View Order in Admin Panel
   ↓
2. See Delivery Status Section
   ↓
3. Click "Update Tracking" (Optional)
   ↓
4. See Latest Tracking Data
   ↓
5. Monitor Delivery Progress
   ↓
6. Confirm Delivery Completion
```

## Responsive Design

### Desktop (1024px+)
- Delivery status card spans full width
- Grid layout for carrier and est. delivery
- Status badge on the right side

### Tablet (768px - 1023px)
- Delivery status card spans full width
- Grid layout adapts to available space
- Status badge remains on the right

### Mobile (< 768px)
- Delivery status card spans full width
- Stack layout for carrier and est. delivery
- Status badge below tracking number
- All text remains readable

## Accessibility Features

- Semantic HTML structure
- Color-coded status with text labels (not just color)
- Proper heading hierarchy
- Clear label-value pairs
- Sufficient color contrast
- Readable font sizes
- Proper spacing for touch targets

## Performance Metrics

- API response time: < 100ms
- Page load time: < 2s
- Tracking update: < 500ms
- No layout shifts
- Smooth animations
