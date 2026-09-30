# 💍 VIWAH — Premium Wedding Marketplace

VIWAH is a modern, full-stack wedding marketplace designed to help couples discover wedding venues, photographers, makeup artists, decorators, caterers, mehendi artists, DJs, and other wedding professionals.

The platform includes a public-facing marketplace along with a secure admin dashboard for managing vendors, venues, reviews, enquiries, and marketplace content.

## ✨ Features

### 🌐 Public Marketplace

- Premium responsive wedding website
- Browse wedding venues
- Browse wedding vendors
- Category-based vendor discovery
- Search, filtering and sorting
- Detailed vendor and venue pages
- Real wedding stories
- Customer enquiries
- Contact form
- Reviews and ratings
- SEO-friendly pages
- Mobile, tablet and desktop responsive UI

### 🔐 Admin Dashboard

- Secure admin authentication
- Protected admin routes
- Dashboard statistics
- Vendor CRUD management
- Venue CRUD management
- Activate/deactivate listings
- Review management
- Enquiry management
- Admin settings
- Change password
- Forgot/reset password
- Rate limiting for authentication
- Public marketplace automatically reflects admin changes

### 🗄️ Backend

- MongoDB database
- Mongoose models
- REST API architecture
- Secure HTTP-only authentication cookies
- Password hashing
- Server-side validation
- Environment-based configuration

## 🛠️ Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide Icons
- MongoDB
- Mongoose
- Zod
- React Hook Form
- Cloudinary
- Resend

## 📁 Project Structure

```text
VIWAH
├── app/
│   ├── admin/
│   ├── api/
│   ├── venues/
│   ├── vendors/
│   ├── real-weddings/
│   ├── about/
│   └── contact/
├── components/
│   ├── admin/
│   ├── marketplace/
│   └── site/
├── lib/
├── models/
├── scripts/
├── middleware.ts
├── package.json
└── next.config.ts
