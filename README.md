# Library & Institute Management System (LIMS)

A comprehensive web application for managing educational institutions, featuring student management, attendance tracking, fee collection, library operations, and seat allocation.

## 🚀 Features

### Core Modules
- **Dashboard** - Analytics and overview with real-time statistics
- **Student Management** - Complete CRUD operations for student records
- **Attendance System** - Daily attendance tracking for morning/evening shifts
- **Fee Management** - Fee collection, receipt generation, and payment tracking
- **Library Management** - Book catalog, issue/return system, and overdue tracking
- **Seating & Locker Management** - Visual seat allocation and locker assignments
- **Reporting & Analytics** - Comprehensive reports with export capabilities
- **Settings & Configuration** - System configuration and user management

### User Roles & Access Control
- **Super Admin** - Full system access
- **Admin** - Academic + library + finance management
- **Accountant** - Fee management only
- **Librarian** - Library + expenses management
- **Teacher/Staff** - Attendance + student information view
- **Student** - Personal profile + dues + books issued

### Technical Features
- **Role-Based Access Control (RBAC)** - Secure access based on user roles
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Real-time Updates** - Live data synchronization
- **Data Export** - PDF, Excel, and CSV export capabilities
- **Multi-language Support** - English/Hindi language options
- **Progressive Web App (PWA)** - Offline capabilities and mobile app-like experience

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **React Hook Form** - Form handling and validation
- **Recharts** - Data visualization and charts
- **Heroicons** - Beautiful SVG icons
- **React Hot Toast** - Toast notifications

### State Management
- **React Context** - Global state management
- **Local Storage** - Client-side data persistence

### UI Components
- **Custom Components** - Modular and reusable UI components
- **Responsive Grid System** - Flexible layout system
- **Dark/Light Mode** - Theme support
- **Accessibility** - WCAG compliant design

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-institute-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Accounts

The application includes pre-configured demo accounts for testing different user roles:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@institute.com | password123 |
| Accountant | accountant@institute.com | password123 |
| Librarian | librarian@institute.com | password123 |
| Teacher | teacher@institute.com | password123 |
| Student | student@institute.com | password123 |

## 📁 Project Structure

```
library-institute-management-system/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── students/          # Student management
│   ├── library/           # Library management
│   ├── fees/              # Fee management
│   ├── seating/           # Seating management
│   ├── login/             # Authentication page
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── layout/           # Layout components
│   ├── dashboard/        # Dashboard components
│   ├── students/         # Student management
│   ├── library/          # Library components
│   ├── fees/             # Fee management
│   └── seating/          # Seating components
├── contexts/             # React Context providers
├── lib/                  # Utility functions and mock data
├── types/                # TypeScript type definitions
└── styles/               # Global styles and configurations
```

## 🎨 Design System

### Color Palette
- **Primary Blue** - Main brand color for actions and highlights
- **Neutral Slate** - Professional grays for content and backgrounds
- **Semantic Colors** - Status indicators (success, warning, error, info)

### Typography
- **Font Family** - Inter (Google Fonts)
- **Type Scale** - Consistent sizing from 11px to 32px
- **Weights** - 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Components
- **Cards** - Elevated surfaces with subtle shadows
- **Tables** - Data-dense layouts with hover states
- **Forms** - Clean inputs with validation feedback
- **Modals** - Overlay dialogs for focused interactions
- **Charts** - Interactive data visualizations

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=LIMS
```

### Customization
- **Branding** - Update logo and colors in `tailwind.config.js`
- **Mock Data** - Modify sample data in `lib/mockData.ts`
- **Authentication** - Configure in `contexts/AuthContext.tsx`

## 📊 Features Overview

### Dashboard Analytics
- Real-time student statistics
- Fee collection tracking
- Library usage metrics
- Attendance trends
- Alert notifications
- Quick action shortcuts

### Student Management
- Complete student profiles
- Enrollment number generation
- Shift assignment (morning/evening)
- Contact information management
- Guardian details
- Status tracking (active/inactive)

### Attendance System
- Daily attendance marking
- Morning/evening shift tracking
- Bulk attendance operations
- Attendance reports and analytics
- Low attendance alerts

### Fee Management
- Multiple fee categories
- Automatic invoice generation
- Payment recording
- Receipt generation with QR codes
- Pending fee tracking
- Financial reporting

### Library Operations
- Book catalog management
- Issue/return tracking
- Overdue book notifications
- Fine calculation
- Category management
- Availability tracking

### Seating Management
- Visual seat map
- Drag-and-drop assignment
- Locker management
- Occupancy tracking
- Room-wise organization
- Student-seat linking

## 🔒 Security Features

- **Authentication** - JWT-based secure login
- **Authorization** - Role-based access control
- **Data Validation** - Client and server-side validation
- **Input Sanitization** - XSS and injection prevention
- **Secure Headers** - Security best practices
- **Audit Trails** - Activity logging

## 📱 Mobile Support

- **Responsive Design** - Optimized for all screen sizes
- **Touch Friendly** - Large touch targets
- **Mobile Navigation** - Hamburger menu for mobile
- **Offline Support** - PWA capabilities
- **Fast Loading** - Optimized performance

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify** - Static site hosting
- **AWS S3** - Cloud storage with CloudFront
- **Docker** - Containerized deployment

### 🌐 Unified SaaS Deployment

This repository includes a complete SaaS platform with both the main LIMS application and a marketing website for customer acquisition.

#### Architecture
- **Main App**: `app.yourdomain.com` - LIMS dashboard and management features
- **Marketing Site**: `www.yourdomain.com` - Landing page, features, pricing, testimonials

#### Unified Deployment Setup
1. **Prerequisites**: Docker and Docker Compose
2. **Configuration**: Update `nginx.conf` with your domain names
3. **SSL**: Obtain certificates for both domains
4. **Deployment**: Run `./deploy.sh` to build and deploy both applications

#### SaaS Marketing Website Features (in `/saas-website/`)
- Complete marketing website with:
  - Landing page with hero section
  - Features and benefits showcase
  - Pricing plans
  - Testimonials
  - FAQ section
  - Contact form
  - SEO optimization
  - Performance optimized
  - Mobile responsive

#### Benefits of Unified Deployment
- **Single Infrastructure**: Manage both applications from one codebase
- **Shared Resources**: Efficient resource utilization
- **Consistent Branding**: Unified design and experience
- **Centralized Management**: Single point of administration
- **Cost Effective**: Reduced hosting costs
- **Scalable**: Architecture designed for growth

## 🧪 Testing

### Running Tests
```bash
npm run test
# or
yarn test
```

### Test Coverage
- Unit tests for components
- Integration tests for features
- End-to-end testing with Playwright

## 📈 Performance

### Optimization Features
- **Code Splitting** - Automatic route-based splitting
- **Image Optimization** - Next.js Image component
- **Lazy Loading** - Component-level lazy loading
- **Caching** - Static and dynamic caching strategies
- **Bundle Analysis** - Webpack bundle analyzer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## 🔄 Version History

### v1.0.0 (Current)
- Initial release with core features
- Student management system
- Library management
- Fee collection system
- Seating allocation
- Dashboard analytics
- Role-based access control

## 🎯 Roadmap

### Upcoming Features
- [ ] Mobile application
- [ ] Advanced reporting
- [ ] Integration with payment gateways
- [ ] SMS/Email notifications
- [ ] Bulk operations
- [ ] Advanced analytics
- [ ] Multi-institution support
- [ ] API documentation
- [ ] Database migration tools

---

**Built with ❤️ using Next.js, TypeScript, and TailwindCSS**