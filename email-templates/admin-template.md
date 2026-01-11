# Admin Notification Email Template

Use this template in EmailJS for admin notifications.

**Template ID**: Use for `VITE_EMAILJS_TEMPLATE_ID_ADMIN`

## Subject Line:
```
🚨 New Order Alert - {{order_number}}
```

## Email Body:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px; }
        .content { padding: 20px 0; }
        .order-info { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; border-radius: 8px; margin-top: 30px; }
        .urgent { color: #dc3545; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 NEW ORDER ALERT</h1>
            <h2>LUXEMEN Admin Panel</h2>
        </div>
        
        <div class="content">
            <p>Hello Admin,</p>
            
            <p class="urgent">A new order has been placed and requires your attention!</p>
            
            <div class="order-info">
                <h3>📋 Order Details</h3>
                <p><strong>Order Number:</strong> {{order_number}}</p>
                <p><strong>Customer:</strong> {{customer_name}}</p>
                <p><strong>Total Amount:</strong> ${{total}}</p>
                <p><strong>Message:</strong> {{message}}</p>
            </div>
            
            <p>Please log in to the admin panel to process this order:</p>
            <p><a href="https://yourstore.com/admin" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Admin Panel</a></p>
        </div>
        
        <div class="footer">
            <p><strong>LUXEMEN Admin System</strong></p>
            <p><small>This is an automated notification from your e-commerce system.</small></p>
        </div>
    </div>
</body>
</html>
```

## Variables Used:
- `{{to_email}}` - Admin email (jvedant.711@gmail.com)
- `{{to_name}}` - Admin name (Admin)
- `{{order_number}}` - Order number
- `{{customer_name}}` - Customer name
- `{{total}}` - Order total amount
- `{{message}}` - Custom message