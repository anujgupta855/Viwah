# VIWAH — Production Hosting Checklist

## 1. Local verification
```bash
npm install
npm run build
npm start
```

## 2. MongoDB
Use a production MongoDB Atlas database. Do not run `npm run db:seed` against a database containing live records because the seed resets marketplace collections.

## 3. Environment variables
Set these in the hosting provider:

```env
MONGODB_URI=your-production-mongodb-uri
AUTH_SECRET=long-random-secret-32-plus-characters
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-initial-admin-password
NEXT_PUBLIC_APP_URL=https://your-domain.com
RESEND_API_KEY=optional-for-forgot-password-email
RESEND_FROM_EMAIL=optional-verified-sender
CLOUDINARY_CLOUD_NAME=optional
CLOUDINARY_API_KEY=optional
CLOUDINARY_API_SECRET=optional
```

Do not commit `.env.local`.

## 4. Admin password
- Change password from **Admin → Settings** after first login.
- Forgot password uses a one-time, 30-minute reset token.
- For production email delivery, configure `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.

## 5. Deployment
Recommended flow for Vercel/any Node hosting:
1. Push the source ZIP contents to GitHub.
2. Import the repository into the hosting provider.
3. Add all environment variables.
4. Build command: `npm run build`.
5. Start command for a Node server: `npm start`.
6. For Vercel, use the Next.js framework preset and let Vercel run the build.

## 6. Image architecture
The seed data uses remote Unsplash images. The application is structured so vendor/venue image URLs are stored in MongoDB. Cloudinary environment variables are reserved for the managed-upload integration; configure the provider before enabling uploads in production.
