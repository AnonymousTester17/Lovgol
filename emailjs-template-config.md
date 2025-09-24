
# EmailJS Project Update Template Configuration

## Template ID: `template_project_update`

### Template Variables:
- `{{to_email}}` - Client email address
- `{{to_name}}` - Client name
- `{{project_title}}` - Project title
- `{{progress_percentage}}` - Current progress percentage
- `{{progress_description}}` - Description of current progress
- `{{client_link}}` - Link to client project dashboard
- `{{estimated_delivery}}` - Estimated delivery in days
- `{{project_health}}` - Project health status (GREEN/YELLOW/RED)
- `{{delivery_status}}` - Delivery status
- `{{payment_status}}` - Payment status
- `{{from_name}}` - Sender name (LOVGOL Team)
- `{{reply_to}}` - Reply email address

### HTML Template:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Update - {{project_title}}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .progress-bar { width: 100%; height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden; margin: 10px 0; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #4CAF50, #45a049); width: {{progress_percentage}}%; }
        .status-badge { display: inline-block; padding: 5px 10px; border-radius: 20px; color: white; font-weight: bold; margin: 5px 0; }
        .green { background: #4CAF50; }
        .yellow { background: #FF9800; }
        .red { background: #f44336; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Project Update</h1>
            <h2>{{project_title}}</h2>
        </div>
        
        <div class="content">
            <p>Dear {{to_name}},</p>
            
            <p>We have an exciting update on your project! Here's the latest progress:</p>
            
            <h3>📊 Current Progress: {{progress_percentage}}%</h3>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            
            <h3>📝 What we accomplished:</h3>
            <p>{{progress_description}}</p>
            
            <h3>📋 Project Status Overview:</h3>
            <ul>
                <li><strong>Project Health:</strong> <span class="status-badge {{#if (eq project_health 'GREEN')}}green{{else if (eq project_health 'YELLOW')}}yellow{{else}}red{{/if}}">{{project_health}}</span></li>
                <li><strong>Estimated Delivery:</strong> {{estimated_delivery}} days</li>
                <li><strong>Delivery Status:</strong> {{delivery_status}}</li>
                <li><strong>Payment Status:</strong> {{payment_status}}</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="{{client_link}}" class="button">View Live Project Status</a>
            </div>
            
            <p>You can access your real-time project dashboard using the link above. The dashboard is updated continuously and provides detailed insights into your project's progress.</p>
            
            <p>If you have any questions or feedback, please don't hesitate to reach out to us. We're here to ensure your project exceeds expectations!</p>
            
            <p>Best regards,<br>
            The LOVGOL Team</p>
        </div>
        
        <div class="footer">
            <p>© 2024 LOVGOL. All rights reserved.</p>
            <p>This email was sent regarding your project: {{project_title}}</p>
        </div>
    </div>
</body>
</html>
```

### Subject Line:
```
🚀 Progress Update: {{project_title}} - {{progress_percentage}}% Complete
```

## Setup Instructions:
1. Go to your EmailJS dashboard
2. Create a new template with ID: `template_project_update`
3. Copy the HTML content above into the template
4. Set the subject line as shown
5. Map the variables correctly
6. Test the template before using in production
