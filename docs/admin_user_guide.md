# Admin Dashboard User Guide
## YBF Studio Administration System

**Version**: 1.0  
**Last Updated**: December 2024  
**Phase**: 8 (Testing & Polish) - Complete

---

## 📋 **TABLE OF CONTENTS**

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Beat Management](#beat-management)
4. [Blog Management](#blog-management)
5. [Service Management](#service-management)
6. [FAQ Management](#faq-management)
7. [Order Management](#order-management)
8. [Analytics & Reporting](#analytics--reporting)
9. [Settings & Configuration](#settings--configuration)
10. [Testing & Quality Assurance](#testing--quality-assurance)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

---

## 🚀 **GETTING STARTED**

### **Accessing the Admin Dashboard**

1. **Navigate to**: `https://yourdomain.com/admin`
2. **Sign In**: Use your admin Google account
3. **Authentication**: Only authorized admin emails can access the system

### **Admin Roles**

- **Admin**: Full system access and user management
- **Editor**: Content management (beats, blog, services, orders, analytics)
- **Viewer**: Read-only access to analytics and orders

### **System Requirements**

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- Admin email address authorized in the system

---

## 📊 **DASHBOARD OVERVIEW**

### **Main Dashboard (`/admin`)**

The main dashboard provides an overview of your audio service business:

#### **Key Metrics**
- **Total Beats**: Number of beats in your catalog
- **Total Orders**: Number of completed orders
- **Total Revenue**: Total revenue generated
- **Recent Activity**: Latest orders and system events

#### **Quick Actions**
- **Add New Beat**: Quick access to beat creation
- **View Orders**: Recent order management
- **Analytics**: Performance overview
- **Settings**: System configuration

---

## 🎵 **BEAT MANAGEMENT**

### **Accessing Beat Management**
- Navigate to: **Admin Panel → Beats**
- URL: `/admin/beats`

### **Managing Your Beat Catalog**

#### **Viewing Beats**
- **List View**: All beats with search and filtering
- **Search**: Find beats by title, artist, or genre
- **Filter**: Filter by genre, price range, or status
- **Sort**: Sort by date, title, price, or popularity

#### **Adding New Beats**

1. **Click "Add New Beat"**
2. **Fill in Basic Information**:
   - **Title**: Beat name
   - **Artist**: Producer name
   - **Genre**: Musical genre
   - **BPM**: Beats per minute
   - **Price**: Base price in USD
   - **Description**: Beat description

3. **Upload Audio Files**:
   - **Preview File**: Short preview (MP3, WAV, AIFF, FLAC)
   - **Full Track**: Complete beat file
   - **File Size**: Maximum 10MB per file

4. **Add Cover Art**:
   - **Image**: JPG, PNG format
   - **Dimensions**: Recommended 800x800px
   - **File Size**: Maximum 5MB

5. **Configure Licenses**:
   - **MP3 License**: Basic usage rights
   - **WAV License**: High-quality audio
   - **Unlimited License**: Commercial usage
   - **Exclusive License**: Full rights transfer

6. **Set Preview Settings**:
   - **Preview Duration**: How long the preview plays
   - **Preview Start Time**: When preview begins

7. **Click "Create Beat"**

#### **Editing Beats**

1. **Find the beat** in the list
2. **Click "Edit"** button
3. **Update information** as needed
4. **Click "Update Beat"**

#### **Deleting Beats**

1. **Find the beat** in the list
2. **Click "Delete"** button
3. **Confirm deletion** in the popup
4. **Beat is soft-deleted** (can be restored)

#### **Beat Status Management**

- **Active**: Available for purchase
- **Draft**: Not yet published
- **Archived**: Temporarily unavailable

---

## 📝 **BLOG MANAGEMENT**

### **Accessing Blog Management**
- Navigate to: **Admin Panel → Blog**
- URL: `/admin/blog`

### **Managing Blog Content**

#### **Creating Blog Posts**

1. **Click "Add New Post"**
2. **Fill in Post Details**:
   - **Title**: Post headline
   - **Slug**: URL-friendly version (auto-generated)
   - **Content**: Use the rich text editor
   - **Excerpt**: Short summary
   - **Featured Image**: Post thumbnail

3. **SEO Settings**:
   - **Meta Title**: Search engine title
   - **Meta Description**: Search engine description
   - **Keywords**: SEO keywords

4. **Publishing Options**:
   - **Status**: Draft or Published
   - **Publish Date**: Schedule publication
   - **Author**: Post author

5. **Click "Create Post"**

#### **Rich Text Editor Features**

- **Formatting**: Bold, italic, underline
- **Headings**: H1, H2, H3
- **Lists**: Bullet and numbered lists
- **Links**: Add internal and external links
- **Images**: Insert and resize images
- **Code**: Code blocks and inline code
- **Quotes**: Blockquotes

#### **Managing Posts**

- **Edit**: Update existing posts
- **Delete**: Remove posts (soft delete)
- **Duplicate**: Create copy of existing post
- **Preview**: View post before publishing

---

## 💼 **SERVICE MANAGEMENT**

### **Accessing Service Management**
- Navigate to: **Admin Panel → Services**
- URL: `/admin/services`

### **Managing Audio Services**

#### **Service Categories**

1. **Mixing & Mastering**
   - Professional audio mixing
   - Mastering for different platforms
   - Quality assurance

2. **Sound Design**
   - Custom sound effects
   - Foley recording
   - Audio post-production

3. **Voice Recording**
   - Professional voice-over
   - Podcast recording
   - Audio book narration

#### **Adding New Services**

1. **Click "Add New Service"**
2. **Service Information**:
   - **Name**: Service title
   - **Description**: Detailed description
   - **Category**: Service type
   - **Price**: Service cost
   - **Duration**: Estimated completion time

3. **Service Features**:
   - **Features**: List of included features
   - **Requirements**: What clients need to provide
   - **Deliverables**: What clients receive

4. **Media**:
   - **Before/After Audio**: Demo files
   - **Images**: Service visuals
   - **Video**: Process demonstration

5. **Click "Create Service"**

#### **Service Status**

- **Active**: Available for booking
- **Inactive**: Temporarily unavailable
- **Coming Soon**: Future service

---

## ❓ **FAQ MANAGEMENT**

### **Accessing FAQ Management**
- Navigate to: **Admin Panel → FAQ**
- URL: `/admin/faq`

### **Managing Frequently Asked Questions**

#### **Adding FAQ Items**

1. **Click "Add New FAQ"**
2. **Question**: Clear, concise question
3. **Answer**: Detailed, helpful answer
4. **Category**: FAQ grouping
5. **Order**: Display order
6. **Click "Create FAQ"**

#### **FAQ Categories**

- **General**: Basic questions
- **Pricing**: Cost-related questions
- **Technical**: Technical support
- **Licensing**: Usage rights
- **Support**: Customer service

#### **Managing FAQs**

- **Edit**: Update questions and answers
- **Reorder**: Change display order
- **Delete**: Remove FAQ items
- **Bulk Actions**: Manage multiple items

---

## 🛒 **ORDER MANAGEMENT**

### **Accessing Order Management**
- Navigate to: **Admin Panel → Orders**
- URL: `/admin/orders`

### **Managing Customer Orders**

#### **Order Overview**

- **Order Number**: Unique identifier
- **Customer**: Customer information
- **Items**: Purchased beats/services
- **Total**: Order amount
- **Status**: Order status
- **Date**: Order date

#### **Order Statuses**

- **Pending**: Payment processing
- **Paid**: Payment received
- **Processing**: Order being fulfilled
- **Completed**: Order delivered
- **Cancelled**: Order cancelled
- **Refunded**: Payment refunded

#### **Order Actions**

1. **View Order Details**:
   - Click on order to see full details
   - View customer information
   - See order items and pricing
   - Check payment status

2. **Update Order Status**:
   - Change order status
   - Add admin notes
   - Update tracking information

3. **Process Orders**:
   - Generate download links
   - Send confirmation emails
   - Update inventory

#### **Order Filters**

- **Status**: Filter by order status
- **Date Range**: Filter by order date
- **Customer**: Search by customer
- **Order Type**: Beat or service orders

---

## 📈 **ANALYTICS & REPORTING**

### **Accessing Analytics**
- Navigate to: **Admin Panel → Analytics**
- URL: `/admin/analytics`

### **Analytics Dashboard**

#### **Sales Analytics**

- **Revenue Overview**: Total revenue and trends
- **Sales Chart**: Visual sales data
- **Top Products**: Best-selling beats and services
- **Revenue by Period**: Daily, weekly, monthly breakdown

#### **Customer Analytics**

- **Customer Metrics**: Total customers, new customers
- **Customer Growth**: Customer acquisition trends
- **Retention Rate**: Customer return rate
- **Customer Behavior**: Purchase patterns

#### **Performance Analytics**

- **Beat Performance**: Top-selling beats
- **Genre Analysis**: Popular genres
- **Page Views**: Website traffic
- **Conversion Rates**: Sales conversion

#### **Date Range Filtering**

- **Last 7 Days**: Recent performance
- **Last 30 Days**: Monthly trends
- **Last 90 Days**: Quarterly analysis
- **Custom Range**: Specific date range

---

## ⚙️ **SETTINGS & CONFIGURATION**

### **Accessing Settings**
- Navigate to: **Admin Panel → Settings**
- URL: `/admin/settings`

### **Site Configuration**

#### **General Settings**

- **Site Name**: Your website name
- **Site Description**: Website description
- **Contact Email**: Primary contact email
- **Contact Phone**: Business phone number
- **Business Address**: Physical address
- **Timezone**: Default timezone
- **Currency**: Default currency
- **Language**: Default language

#### **Email Configuration**

- **Email Provider**: SendGrid, SMTP, etc.
- **From Name**: Email sender name
- **From Address**: Email sender address
- **SMTP Settings**: Server configuration
- **Test Email**: Verify email setup

#### **Payment Settings**

- **Stripe Keys**: Payment gateway configuration
- **Payment Methods**: Accepted payment methods
- **Tax Settings**: Tax calculation and rates
- **Currency**: Payment currency

#### **Social Media**

- **Facebook**: Facebook page URL
- **Twitter**: Twitter profile URL
- **Instagram**: Instagram profile URL
- **YouTube**: YouTube channel URL
- **LinkedIn**: LinkedIn company page

#### **SEO Configuration**

- **Meta Title Template**: Default page titles
- **Meta Description Template**: Default descriptions
- **Keywords**: Default SEO keywords
- **Google Analytics**: Analytics tracking ID

#### **Security Settings**

- **Session Timeout**: User session duration
- **Login Attempts**: Maximum failed attempts
- **Password Policy**: Password requirements
- **File Upload Limits**: File size restrictions

### **User Management**

#### **Admin Users**

- **Add Users**: Create new admin accounts
- **Edit Users**: Update user information
- **Role Management**: Assign user roles
- **Permissions**: Set user permissions
- **Activity Tracking**: Monitor user activity

#### **User Roles**

- **Admin**: Full system access
- **Editor**: Content management access
- **Viewer**: Read-only access

### **System Backups**

#### **Backup Management**

- **Create Backup**: Manual backup creation
- **Backup Types**: Full, partial, settings-only
- **Backup History**: View previous backups
- **Restore**: Restore from backup
- **Delete**: Remove old backups

### **System Information**

#### **System Monitoring**

- **Database Stats**: Record counts and performance
- **Environment Info**: Server and platform details
- **System Logs**: Activity and error logs
- **Performance Metrics**: System performance data

---

## 🧪 **TESTING & QUALITY ASSURANCE**

### **Accessing Testing Dashboard**
- Navigate to: **Admin Panel → Testing**
- URL: `/admin/testing`

### **Comprehensive Testing Suite**

#### **Automated Tests**

1. **Run All Tests**:
   - Click "Run All Tests" button
   - Monitor test progress
   - View test results

2. **Test Categories**:
   - **Database Tests**: Connection and operations
   - **API Tests**: Endpoint functionality
   - **Authentication Tests**: Security verification
   - **Performance Tests**: Response times
   - **Error Handling Tests**: Edge case handling

#### **Test Results**

- **Passed Tests**: Successful test executions
- **Failed Tests**: Issues requiring attention
- **Skipped Tests**: Manual tests required
- **Test Duration**: Total execution time

#### **Test Reports**

- **Download Report**: Export test results
- **Detailed Results**: Individual test outcomes
- **Performance Metrics**: Response time analysis
- **Error Details**: Specific failure information

### **UI/UX Testing**

#### **Responsive Design Testing**

- **Mobile Testing**: 375px width
- **Tablet Testing**: 768px width
- **Desktop Testing**: 1024px width
- **Large Desktop**: 1440px width

#### **Accessibility Testing**

- **Color Contrast**: WCAG compliance
- **Keyboard Navigation**: Tab navigation
- **Screen Reader**: Voice-over compatibility
- **Focus Indicators**: Visual focus states

#### **Cross-Browser Testing**

- **Chrome**: Google Chrome browser
- **Firefox**: Mozilla Firefox browser
- **Safari**: Apple Safari browser
- **Edge**: Microsoft Edge browser

---

## 📚 **BEST PRACTICES**

### **Content Management**

#### **Beat Management**
- **Consistent Naming**: Use clear, descriptive titles
- **Quality Audio**: Ensure high-quality preview and full tracks
- **Accurate Metadata**: Fill in all beat information
- **Regular Updates**: Keep catalog fresh and current

#### **Blog Management**
- **SEO Optimization**: Use relevant keywords and meta descriptions
- **Quality Content**: Write informative, engaging posts
- **Regular Publishing**: Maintain consistent posting schedule
- **Image Optimization**: Use properly sized images

#### **Service Management**
- **Clear Descriptions**: Explain services thoroughly
- **Accurate Pricing**: Set competitive, fair prices
- **Before/After Examples**: Show service quality
- **Clear Requirements**: Specify client deliverables

### **Order Management**

#### **Customer Service**
- **Quick Response**: Respond to orders promptly
- **Clear Communication**: Keep customers informed
- **Quality Delivery**: Ensure high-quality deliverables
- **Follow-up**: Check customer satisfaction

#### **Order Processing**
- **Status Updates**: Keep orders current
- **Quality Control**: Verify deliverables
- **Documentation**: Maintain order records
- **Refund Policy**: Handle returns professionally

### **Analytics & Reporting**

#### **Data Analysis**
- **Regular Review**: Check analytics weekly
- **Trend Analysis**: Identify patterns and trends
- **Performance Tracking**: Monitor key metrics
- **Action Planning**: Use data for decisions

### **System Maintenance**

#### **Regular Tasks**
- **Backup Creation**: Create regular backups
- **Log Review**: Monitor system logs
- **Performance Check**: Monitor system performance
- **Security Updates**: Keep system secure

#### **User Management**
- **Role Assignment**: Assign appropriate roles
- **Permission Review**: Regular permission audits
- **Activity Monitoring**: Track user activity
- **Account Security**: Maintain secure accounts

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues**

#### **Login Problems**
- **Issue**: Cannot access admin panel
- **Solution**: Verify admin email is authorized
- **Check**: Email is in ADMIN_EMAILS environment variable

#### **File Upload Issues**
- **Issue**: Cannot upload audio or image files
- **Solution**: Check file size and format
- **Limits**: 10MB for audio, 5MB for images
- **Formats**: MP3, WAV, AIFF, FLAC for audio; JPG, PNG for images

#### **Email Configuration**
- **Issue**: Test emails not sending
- **Solution**: Verify email service configuration
- **Check**: SMTP settings and API keys
- **Test**: Use email testing feature in settings

#### **Database Issues**
- **Issue**: Data not loading or saving
- **Solution**: Check database connection
- **Verify**: Supabase configuration
- **Contact**: System administrator if issues persist

#### **Performance Issues**
- **Issue**: Slow page loading
- **Solution**: Check system resources
- **Monitor**: Analytics dashboard for performance
- **Optimize**: Reduce file sizes and optimize images

### **Getting Help**

#### **Support Resources**
- **Documentation**: This user guide
- **System Logs**: Check logs in settings
- **Testing Dashboard**: Run diagnostic tests
- **Admin Support**: Contact system administrator

#### **Emergency Procedures**
- **System Backup**: Create backup before major changes
- **Rollback**: Restore from backup if needed
- **Contact Admin**: For critical system issues
- **Document Issues**: Record problems for resolution

---

## 📞 **CONTACT & SUPPORT**

### **Technical Support**
- **Email**: jmaconny@ybfstudio.com
- **Documentation**: This user guide
- **Testing**: Use testing dashboard for diagnostics
- **Logs**: Check system logs for error details

### **System Information**
- **Version**: Admin Dashboard v1.0
- **Last Updated**: December 2024
- **Phase**: 8 (Testing & Polish) - Complete
- **Status**: Production Ready

---

**🎉 Congratulations! You're now ready to manage your YBF Studio admin dashboard effectively.**

This guide covers all aspects of the admin system. For additional support or questions, please refer to the troubleshooting section or contact the system administrator. 