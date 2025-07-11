# Environment Variables for Cyclic Deployment

Copy these environment variables in your Cyclic dashboard:

## Required Variables:
```
NODE_ENV=production
JWT_SECRET=zp2mb30yA18SG9cEidq
ADMIN_SECRET_CODE=lance
EMAIL_USER=lancebrower@gmail.com
EMAIL_PASSWORD=irdpzipmoaaduvjx
ADMIN_EMAIL=lancebrower@gmail.com
```

## How to add in Cyclic:
1. Go to your app dashboard
2. Click "Variables" tab
3. Add each variable above
4. Deploy your app

## Notes:
- PORT is automatically set by Cyclic
- DB_PATH will use the default ./crm.db
- Update EMAIL_* variables with your own email settings for production 