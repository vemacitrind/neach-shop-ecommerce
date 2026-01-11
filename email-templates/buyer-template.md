# Buyer Confirmation Email Template

Use this template in EmailJS for buyer notifications.

**Template ID**: Use for `VITE_EMAILJS_TEMPLATE_ID_BUYER`

## Subject Line:
```
Order Update - {{order_number}}
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
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
        .content { padding: 20px 0; }
        .status { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; border-radius: 8px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛍️ LUXEMEN</h1>
            <h2>Order Status Update</h2>
        </div>
        
        <div class="content">
            <p>Dear {{to_name}},</p>
            
            <p>We wanted to update you on your recent order with us.</p>
            
            <div class="status">
                <h3>📦 Order: {{order_number}}</h3>
                <p><strong>Status:</strong> {{status}}</p>
                <p>{{message}}</p>
            </div>
            
            <p>Thank you for choosing LUXEMEN. We appreciate your business!</p>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
        
        <div class="footer">
            <p>Best regards,<br>
            <strong>LUXEMEN Team</strong></p>
            <p><small>This is an automated message. Please do not reply to this email.</small></p>
        </div>
    </div>
</body>
</html>
```

## Variables Used:
- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer email (auto-filled by EmailJS)
- `{{order_number}}` - Order number
- `{{status}}` - Order status
- `{{message}}` - Custom message