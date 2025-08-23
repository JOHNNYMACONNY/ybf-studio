# HTML Email Templates - YBF Studio

This directory contains the branded HTML email templates for the consultation system.

## Overview

These templates feature the **YBF Studio brand palette**:
- **Primary**: Emerald (#10B981) - Primary CTAs and links
- **Secondary**: Amber (#F59E0B) - Secondary actions
- **Background**: Deep Black (#0A0A0A) - Main background
- **Panel**: Dark Gray (#171717) - Container background
- **Card**: Medium Gray (#262626) - Content cards
- **Text**: White (#FFFFFF) - Primary text
- **Muted**: Light Gray (#E5E5E5) - Secondary text

## Template Files

| Template | File | Purpose |
|----------|------|---------|
| **Consultation Confirmation** | `consultation_confirmation.html` | Confirm consultation booking with details and prep tips |
| **Calendar Invite** | `calendar_invite.html` | Send calendar invitation with multiple calendar platform options |
| **24-Hour Reminder** | `24_hour_reminder.html` | Remind about upcoming consultation with prep checklist |
| **Post-Consultation Follow-up** | `post_consultation_followup.html` | Send proposal and next steps after consultation |
| **Consultation Cancellation** | `consultation_cancellation.html` | Confirm cancellation with reschedule options |
| **Consultation Rescheduled** | `consultation_rescheduled.html` | Confirm new consultation time details |

**🎉 Complete Email System: 6 Professional Templates**

## Features

### **Responsive Design**
- Mobile-first approach with media queries
- Stackable buttons on small screens
- Optimized for all email clients

### **Accessibility**
- High contrast ratios
- Semantic HTML structure
- Alt text for images
- Dark mode support

### **Brand Consistency**
- YBF Studio logo integration
- Consistent color scheme
- Professional typography (Inter font family)
- Modern button design

## Template Variables

### **Core Variables**
- `{{project_name}}` - Client's project name
- `{{customer_name}}` - Client's name
- `{{date}}` - Consultation date
- `{{time}}` - Consultation time
- `{{timezone}}` - Time zone
- `{{call_type}}` - Communication method (Phone/Zoom/Google Meet)

### **Contact Variables**
- `{{contact_email}}` - Studio contact email
- `{{contact_phone}}` - Studio contact phone
- `{{website_url}}` - Studio website URL
- `{{brand_logo_url}}` - YBF Studio logo URL

### **Calendar Variables**
- `{{add_to_calendar_url}}` - Google Calendar add link
- `{{google_calendar_url}}` - Google Calendar event link
- `{{outlook_calendar_url}}` - Outlook calendar link
- `{{apple_calendar_url}}` - Apple Calendar link
- `{{direct_event_url}}` - Direct event viewing link

### **Call Platform Variables**
- `{{phone_number}}` - Phone number for calls
- `{{zoom_link}}` - Zoom meeting link
- `{{google_meet_link}}` - Google Meet link

### **Action Variables**
- `{{reschedule_url}}` - Rescheduling form link
- `{{prep_faq_url}}` - Preparation FAQ page link

## Implementation Notes

### **SendGrid Integration**
- Use SendGrid Dynamic Templates
- Set up template variables in SendGrid dashboard
- Test with sample data before production

### **Logo Requirements**
- **Dimensions**: 160px width (height auto-scales)
- **Format**: PNG or JPG with transparent background
- **Storage**: Host on CDN or SendGrid assets

### **Testing**
- Test across major email clients
- Verify mobile responsiveness
- Check dark mode compatibility
- Validate all links and buttons

## Usage

1. **Upload to SendGrid**: Import HTML templates as Dynamic Templates
2. **Configure Variables**: Set up all template variables in SendGrid
3. **Test Templates**: Send test emails with sample data
4. **Deploy**: Integrate with consultation system API

## Maintenance

- **Regular Updates**: Review templates quarterly
- **Brand Updates**: Update colors/logo as needed
- **Performance**: Monitor email delivery and engagement rates
- **Compliance**: Ensure GDPR and CAN-SPAM compliance

---

**Created**: [Current Date]  
**Brand**: YBF Studio  
**Design System**: YBF Studio Brand Palette  
**Email Service**: SendGrid  
**Responsive**: Yes  
**Accessibility**: WCAG 2.1 AA Compliant
