# Payment Gateway Integration Setup Guide

This guide explains how to set up the payment gateway integration with ekqr.in/upigateway.

## Environment Variables

Add the following to your `.env` or `.env.local` file:

```env
# Payment Gateway Configuration
# Get your API key from: https://ekqr.in/dashboard → API Settings
PAYMENT_GATEWAY_KEY=your-api-key-here
```

## How to Get Your API Key

1. Sign up at [ekqr.in](https://ekqr.in)
2. Go to Dashboard → API Settings
3. Copy your API Key
4. Add it to your `.env` file as `PAYMENT_GATEWAY_KEY`

## Webhook Configuration

To automatically receive payment status updates, configure your webhook URL in the ekqr.in dashboard:

1. Go to Dashboard → Webhook Settings
2. Set Webhook URL to: `https://yourdomain.com/api/payments/webhook`
3. Make sure the URL includes the protocol (https://)

**Important**: The webhook URL must be publicly accessible. For local development, you can use a service like [ngrok](https://ngrok.com) to expose your local server.

## Payment Flow

1. **User Registration**: User completes registration form (steps 1-4)
2. **Payment Initiation**: User clicks "Pay Now" button
3. **Order Creation**: System creates payment order via `/api/payments/create-order`
4. **Redirect**: User is redirected to payment gateway URL
5. **Payment**: User completes payment on gateway
6. **Webhook**: Gateway sends payment status to `/api/payments/webhook`
7. **Redirect Back**: User is redirected back to `/api/payments/redirect`
8. **Status Check**: System checks payment status and redirects to dashboard
9. **Dashboard**: User sees payment status with success/error message

## API Routes

### Create Payment Order
- **Endpoint**: `POST /api/payments/create-order`
- **Auth**: Required (authenticated user)
- **Response**: Returns `paymentUrl` for redirect

### Webhook Handler
- **Endpoint**: `POST /api/payments/webhook`
- **Auth**: None (public endpoint)
- **Content-Type**: `application/x-www-form-urlencoded`
- **Purpose**: Receives payment status updates from gateway

### Payment Redirect Handler
- **Endpoint**: `GET /api/payments/redirect?client_txn_id=xxx`
- **Auth**: None (public endpoint)
- **Purpose**: Checks payment status and redirects to dashboard

## Database Schema

### Payment Model
The Payment model stores:
- `orderId`: Gateway order ID
- `clientTxnId`: Unique transaction ID for tracking
- `paymentUrl`: Payment gateway URL
- `upiTxnId`: UPI transaction ID (from gateway)
- `paymentStatus`: `pending` | `completed` | `failed`
- `transactionId`: Final transaction ID

### Player Model
The Player model stores:
- `paymentStatus`: `pending` | `completed`
- `paymentDate`: Date of payment
- `transactionId`: Transaction ID

## Testing

### Test Payment Flow
1. Complete registration form
2. Click "Pay Now" button
3. You'll be redirected to payment gateway
4. Complete test payment (use test credentials)
5. You'll be redirected back to dashboard
6. Check payment status in dashboard

### Test Webhook (Local Development)
1. Use ngrok to expose local server: `ngrok http 3000`
2. Update webhook URL in ekqr.in dashboard to ngrok URL
3. Complete a test payment
4. Check server logs for webhook data

## Troubleshooting

### Payment Order Creation Fails
- Check `PAYMENT_GATEWAY_KEY` is set correctly
- Verify API key is valid in ekqr.in dashboard
- Check server logs for error details

### Webhook Not Receiving Updates
- Verify webhook URL is publicly accessible
- Check webhook URL is correctly configured in dashboard
- Verify webhook endpoint is accessible (test with curl/Postman)
- Check server logs for incoming requests

### Payment Status Not Updating
- Check webhook is being called (check logs)
- Verify payment record exists in database
- Check player ID matches in webhook data
- Verify database update queries are working

## Security Notes

1. **API Key**: Never expose your API key in client-side code
2. **Webhook**: Webhook endpoint is public but validates payment records
3. **Validation**: All payment updates validate against existing records
4. **HTTPS**: Always use HTTPS in production for webhook endpoint

## Support

For payment gateway issues:
- Check ekqr.in documentation: https://ekqr.in/docs
- Contact ekqr.in support for API issues
- Check server logs for detailed error messages

