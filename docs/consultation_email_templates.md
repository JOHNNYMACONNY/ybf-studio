# Consultation System Email Templates

> **Email Template Note:** These email templates will be implemented using SendGrid and must be reviewed and approved before implementation. All templates follow professional branding and include proper unsubscribe functionality.

**Related Docs:** [Consultation System Implementation Plan](./consultation_system_implementation_plan.md) | [Premium Journey Implementation Plan](./premium_journey_implementation_plan.md)

## 🎨 **HTML Templates Available**

**Professional YBF Studio branded HTML templates** are available in `docs/email_templates_html/` with:
- **YBF Studio color palette** (Emerald/Amber/Orange on deep black)
- **Mobile-responsive design** with proper media queries
- **Dark mode support** and accessibility features
- **Professional branding** and modern button design

**HTML Templates Created:**
- ✅ **Consultation Confirmation** - `consultation_confirmation.html`
- ✅ **Calendar Invite** - `calendar_invite.html`
- ✅ **24-Hour Reminder** - `24_hour_reminder.html`
- ✅ **Post-Consultation Follow-up** - `post_consultation_followup.html`
- ✅ **Consultation Cancellation** - `consultation_cancellation.html`
- ✅ **Consultation Rescheduled** - `consultation_rescheduled.html`

**🎉 ALL 6 EMAIL TEMPLATES COMPLETED!**

**Note:** Each template includes both **plain-text fallback** and **branded HTML version** for maximum compatibility.

---

## Purpose
This document outlines all email templates required for the consultation system, including content, variables, and delivery timing. All templates are subject to review and approval before implementation.

---

## Table of Contents
- [Email Template Overview](#email-template-overview)
- [Template 1: Consultation Confirmation](#template-1-consultation-confirmation)
- [Template 2: Calendar Invite](#template-2-calendar-invite)
- [Template 3: 24-Hour Reminder](#template-3-24-hour-reminder)
- [Template 4: Post-Consultation Follow-up](#template-4-post-consultation-follow-up)
- [Template 5: Consultation Cancellation](#template-5-consultation-cancellation)
- [Template 6: Consultation Rescheduled](#template-6-consultation-rescheduled)
- [Email Delivery System](#email-delivery-system)
- [Template Approval Process](#template-approval-process)

---

## Email Template Overview

### **Email Types and Timing**
1. **Consultation Confirmation** - Sent immediately after booking
2. **Calendar Invite** - Sent with Google Calendar event details
3. **24-Hour Reminder** - Sent 24 hours before consultation
4. **Post-Consultation Follow-up** - Sent 1-2 days after consultation
5. **Consultation Cancellation** - Sent when consultation is cancelled
6. **Consultation Rescheduled** - Sent when consultation is rescheduled

### **Technical Requirements**
- **Email Service**: SendGrid (existing integration)
- **Template Engine**: SendGrid Dynamic Templates
- **Variable Replacement**: Dynamic content insertion
- **Unsubscribe Functionality**: Required for compliance
- **Delivery Tracking**: Monitor email delivery and engagement

### **Branding Guidelines**
- **Professional Tone**: Friendly but professional
- **Brand Colors**: Use existing brand color palette
- **Logo**: Include company logo in header
- **Contact Information**: Clear contact details in footer
- **Legal Compliance**: GDPR and CAN-SPAM compliance

---

## Template 1: Consultation Confirmation

### **Purpose**
Confirm consultation booking and provide essential details to the client.

### **Delivery Timing**
- **When**: Immediately after consultation booking
- **Priority**: High (critical for client confidence)

### **Subject Line**
```
Consultation confirmed: {{project_name}} on {{date}}
```

### **Email Content**

#### **Plain-Text Version**
```
Hi {{customer_name}},

Your consultation for {{project_name}} is confirmed.

Consultation Details
- Date: {{date}}
- Time: {{time}} {{timezone}}
- Duration: 15 minutes
- Format: {{call_type}}

Project Info
- Project: {{project_name}}
- Genre: {{genre}}    BPM: {{bpm}}
- Description: {{project_description}}

What to Expect
We'll review goals, answer questions, and outline the best plan for mixing/mastering. You'll receive a clear quote after the call.

Prep Tips
- Have a download link ready for stems/reference tracks
- Note references and any must-have details
- Consider your timeline and budget

Add to Calendar: {{add_to_calendar_url}}
Reschedule: {{reschedule_url}}
Prep FAQ: {{prep_faq_url}}

Need to reschedule?
Please give at least 24 hours' notice:
{{contact_email}} | {{contact_phone}}

Looking forward,
Johnny
YBF Studio
{{website_url}}
```

#### **HTML Version (YBF Studio Branded)**
The HTML version includes your YBF Studio color palette (Emerald/Amber/Orange on deep black) with:
- Professional branding and logo
- Mobile-responsive design
- Dark mode support
- Emerald primary buttons (#10B981)
- Amber secondary buttons (#F59E0B)
- Professional typography and spacing

**Note:** Full HTML template available in `docs/email_templates_html/consultation_confirmation.html`

### **Template Variables**
```typescript
interface ConsultationConfirmationVariables {
  // Core consultation details
  project_name: string;
  customer_name: string;
  date: string;
  time: string;
  timezone: string;
  call_type: string;
  
  // Project information
  genre: string;
  bpm: string;
  project_description: string;
  
  // Action URLs
  add_to_calendar_url: string;
  reschedule_url: string;
  prep_faq_url: string;
  
  // Contact information
  contact_email: string;
  contact_phone: string;
  website_url: string;
  
  // Branding
  brand_logo_url: string;
}
```

---

## Template 2: Calendar Invite

### **Purpose**
Provide Google Calendar event details and invitation link.

### **Delivery Timing**
- **When**: Immediately after consultation confirmation
- **Priority**: High (ensures calendar integration)

### **Subject Line**
```
Calendar invite: {{project_name}} consultation on {{date}}
```

### **Email Content**

#### **Plain-Text Version**
```
Hi {{customer_name}},

Here's your calendar invite for our consultation.

Event
- {{project_name}} Consultation
- {{date}} at {{time}} {{timezone}}
- 15 minutes
- {{call_type}} (Phone / Zoom / Google Meet)

Add to Calendar
- Google: {{google_calendar_url}}
- Outlook: {{outlook_calendar_url}}
- Apple: {{apple_calendar_url}}
Direct link: {{direct_event_url}}

Call Details
- Phone: {{phone_number}}
- Zoom: {{zoom_link}}
- Google Meet: {{google_meet_link}}

You'll also receive a reminder 24 hours before the call.

Questions or need to reschedule?
{{contact_email}} | {{contact_phone}}

See you soon,
Johnny
YBF Studio
{{website_url}}
```

#### **HTML Version (YBF Studio Branded)**
The HTML version includes your YBF Studio color palette with:
- Multiple calendar platform buttons (Google, Outlook, Apple)
- Direct event viewing link
- Call platform details (Phone, Zoom, Google Meet)
- Professional branding and responsive design

**Note:** Full HTML template available in `docs/email_templates_html/calendar_invite.html`

### **Template Variables**
```typescript
interface CalendarInviteVariables {
  // Core consultation details
  project_name: string;
  customer_name: string;
  date: string;
  time: string;
  timezone: string;
  call_type: string;
  
  // Calendar URLs
  google_calendar_url: string;
  outlook_calendar_url: string;
  apple_calendar_url: string;
  direct_event_url: string;
  
  // Call platform details
  phone_number: string;
  zoom_link: string;
  google_meet_link: string;
  
  // Contact information
  contact_email: string;
  contact_phone: string;
  website_url: string;
  
  // Branding
  brand_logo_url: string;
}
```

---

## Template 3: 24-Hour Reminder

### **Purpose**
Remind clients about their upcoming consultation and provide final preparation details.

### **Delivery Timing**
- **When**: 24 hours before consultation
- **Priority**: Medium (important for attendance)

### **Subject Line**
```
Reminder: {{project_name}} consultation is tomorrow at {{time}} {{timezone}}
```

### **Email Content**

#### **Plain-Text Version**
```
Hi {{customer_name}},

Friendly reminder that your consultation is tomorrow.

Details
- Project: {{project_name}}
- Date: {{date}}
- Time: {{time}} {{timezone}}
- Duration: 15 minutes
- Format: {{call_type}}

Quick Prep
- Have your stems/reference link handy
- Note any references and must‑have details
- Know your timeline and budget range
- Join from a quiet space

Calendar: {{calendar_event_url}}

Call Info
- Phone: {{phone_number}}
- Zoom: {{zoom_link}}
- Google Meet: {{google_meet_link}}

Need to reschedule?
Please reach out as soon as possible:
{{contact_email}} | {{contact_phone}}

— Johnny, YBF Studio
{{website_url}}
```

#### **HTML Version (YBF Studio Branded)**
The HTML version includes your YBF Studio color palette with:
- Quick prep checklist for consultation readiness
- Call information for all platforms (Phone, Zoom, Google Meet)
- Calendar event access and rescheduling options
- Professional branding and responsive design

**Note:** Full HTML template available in `docs/email_templates_html/24_hour_reminder.html`

### **Template Variables**
```typescript
interface ReminderVariables {
  // Core consultation details
  project_name: string;
  customer_name: string;
  date: string;
  time: string;
  timezone: string;
  call_type: string;
  
  // Calendar and call information
  calendar_event_url: string;
  phone_number: string;
  zoom_link: string;
  google_meet_link: string;
  
  // Contact information
  contact_email: string;
  contact_phone: string;
  website_url: string;
  
  // Branding
  brand_logo_url: string;
}
```

---

## Template 4: Post-Consultation Follow-up

### **Purpose**
Follow up after consultation with next steps and service recommendations.

### **Delivery Timing**
- **When**: 1-2 days after consultation
- **Priority**: High (conversion opportunity)

### **Subject Line**
```
Next steps for {{project_name}} — proposal & files
```

### **Email Content**

#### **Plain-Text Version**
```
Hi {{customer_name}},

Great talking today. Here's a quick recap and next steps for {{project_name}}.

Consultation Summary
- Project: {{project_name}}
- Genre: {{genre}}    BPM: {{bpm}}
- Key requirements: {{key_requirements}}
- Timeline: {{timeline}}
- Budget range: {{budget_range}}

Our Recommendations
- Service package: {{recommended_package}}
- Estimated turnaround: {{turnaround_time}}
- Special considerations: {{special_notes}}
- Investment: {{price_range}}

Next Steps
1) View proposal: {{proposal_url}}
2) Submit files (stems/refs/notes): {{file_upload_url}}
3) Book project / pay deposit: {{booking_url}}
4) Questions? {{contact_email}} | {{contact_phone}}

File Guidelines
- Stems as WAV (24‑bit preferred)
- Reference tracks (links OK)
- Notes / specific instructions

Timeline
- Proposal valid for 7 days to lock in the quote
- Project start within 24–48 hours of confirmation
- Estimated completion: {{completion_date}}

We'll work with you until you're fully satisfied with your mix/master.

— Johnny, YBF Studio
{{website_url}}
{{contact_email}} | {{contact_phone}}
```

#### **HTML Version (YBF Studio Branded)**
The HTML version includes your YBF Studio color palette with:
- Three-tier CTA system (View Proposal, Submit Files, Book Project)
- Project file submission guidelines and upload portal
- Timeline and proposal validity information
- Professional branding and responsive design

**Note:** Full HTML template available in `docs/email_templates_html/post_consultation_followup.html`

### **Template Variables**
```typescript
interface FollowUpVariables {
  // Core consultation details
  project_name: string;
  customer_name: string;
  genre: string;
  bpm: string;
  
  // Consultation summary
  key_requirements: string;
  timeline: string;
  budget_range: string;
  
  // Service recommendations
  recommended_package: string;
  turnaround_time: string;
  special_notes: string;
  price_range: string;
  completion_date: string;
  
  // Action URLs
  proposal_url: string;
  file_upload_url: string;
  booking_url: string;
  
  // Contact information
  contact_email: string;
  contact_phone: string;
  website_url: string;
  
  // Branding
  brand_logo_url: string;
}
```

---

## Template 5: Consultation Cancellation

### **Purpose**
Confirm consultation cancellation and provide rescheduling options.

### **Delivery Timing**
- **When**: Immediately after cancellation
- **Priority**: Medium (maintains relationship)

### **Subject Line**
```
Consultation cancelled — {{project_name}} on {{date}}
```

### **Email Content**

#### **Plain-Text Version**
```
Hi {{customer_name}},

Your consultation for {{project_name}} scheduled for {{date}} at {{time}} has been cancelled as requested.

Cancelled Details
- Project: {{project_name}}
- Date: {{date}}
- Time: {{time}}

Want to reschedule?
Pick a new time: {{reschedule_url}}

Questions?
{{contact_email}} | {{contact_phone}}

— Johnny, YBF Studio
{{website_url}}
```

#### **HTML Version (YBF Studio Branded)**
The HTML version includes your YBF Studio color palette with:
- Clear cancellation confirmation
- Easy rescheduling button with emerald CTA
- Professional, understanding tone
- Clean, simple design

**Note:** Full HTML template available in `docs/email_templates_html/consultation_cancellation.html`

### **Template Variables**
```typescript
interface CancellationVariables {
  // Core consultation details
  project_name: string;
  customer_name: string;
  date: string;
  time: string;
  
  // Action URLs
  reschedule_url: string;
  
  // Contact information
  contact_email: string;
  contact_phone: string;
  website_url: string;
  
  // Branding
  brand_logo_url: string;
}
```

---

## Template 6: Consultation Rescheduled

### **Purpose**
Confirm consultation rescheduling with new details.

### **Delivery Timing**
- **When**: Immediately after rescheduling
- **Priority**: High (ensures client has correct information)

### **Subject Line**
```
Consultation rescheduled — {{project_name}} now on {{new_date}}
```

### **Email Content**

#### **Plain-Text Version**
```
Hi {{customer_name}},

Your consultation for {{project_name}} has been rescheduled.

New Details
- Date: {{new_date}}
- Time: {{new_time}} {{timezone}}
- Duration: 15 minutes
- Format: {{call_type}}

Previous Time (Cancelled)
- {{previous_date}} at {{previous_time}}

Calendar Event: {{calendar_event_url}}

Call Info
- Phone: {{phone_number}}
- Zoom: {{zoom_link}}
- Google Meet: {{google_meet_link}}

We'll send you a reminder 24 hours before the new consultation.

Questions?
{{contact_email}} | {{contact_phone}}

— Johnny, YBF Studio
{{website_url}}
```

#### **HTML Version (YBF Studio Branded)**
The HTML version includes your YBF Studio color palette with:
- Clear comparison between old and new times
- Calendar update button with emerald CTA
- Call platform details for all communication methods
- Professional, organized layout

**Note:** Full HTML template available in `docs/email_templates_html/consultation_rescheduled.html`

### **Template Variables**
```typescript
interface RescheduleVariables {
  // Core consultation details
  project_name: string;
  customer_name: string;
  
  // New consultation details
  new_date: string;
  new_time: string;
  timezone: string;
  call_type: string;
  
  // Previous consultation details
  previous_date: string;
  previous_time: string;
  
  // Calendar and call information
  calendar_event_url: string;
  phone_number: string;
  zoom_link: string;
  google_meet_link: string;
  
  // Contact information
  contact_email: string;
  contact_phone: string;
  website_url: string;
  
  // Branding
  brand_logo_url: string;
}
```

---

## Email Delivery System

### **SendGrid Integration**
- **Template Management**: Use SendGrid Dynamic Templates
- **Variable Replacement**: Dynamic content insertion
- **Delivery Tracking**: Monitor email delivery and engagement
- **Bounce Handling**: Automatic bounce processing

### **Email Scheduling**
- **Immediate**: Confirmation, calendar invite, cancellation, reschedule
- **Scheduled**: 24-hour reminder (automated)
- **Conditional**: Post-consultation follow-up (manual trigger)

### **Delivery Monitoring**
- **Delivery Rate**: Track successful email delivery
- **Open Rate**: Monitor email engagement
- **Click Rate**: Track link clicks and engagement
- **Bounce Rate**: Monitor delivery failures

### **Compliance Features**
- **Unsubscribe Links**: Required for all emails
- **Privacy Policy**: Link to privacy policy
- **Company Information**: Clear sender identification
- **Opt-out Management**: Respect unsubscribe requests

---

## Template Approval Process

### **Review Steps**
1. **Content Review**: Review email content and tone
2. **Branding Approval**: Ensure consistent brand representation
3. **Legal Review**: Verify compliance with email regulations
4. **Technical Review**: Confirm template variables and structure
5. **Final Approval**: Stakeholder sign-off before implementation

### **Approval Checklist**
- [ ] Email content is professional and engaging
- [ ] Branding is consistent with company identity
- [ ] Legal compliance requirements are met
- [ ] Template variables are correctly defined
- [ ] Unsubscribe functionality is included
- [ ] Contact information is accurate
- [ ] Tone matches company voice and style

### **Implementation Timeline**
- **Week 1**: Template review and approval
- **Week 2**: Template implementation in SendGrid
- **Week 3**: Testing and validation
- **Week 4**: Production deployment

---

## Conclusion

These email templates provide a comprehensive communication system for the consultation booking process, ensuring professional client communication at every stage.

**Key Benefits**:
1. **Professional Communication**: Consistent, branded messaging
2. **Client Engagement**: Timely, relevant information delivery
3. **Conversion Optimization**: Strategic follow-up and next steps
4. **Compliance**: Legal and regulatory compliance

**Next Steps**:
1. **Review all templates** for content and tone
2. **Approve final versions** before implementation
3. **Provide feedback** on any areas needing adjustment
4. **Confirm branding elements** and contact information

**Expected Outcome**: A professional email communication system that enhances client experience, improves consultation attendance, and supports the conversion process.

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Template Review Required**: [Stakeholder Names]  
**Implementation Start**: [After Template Approval]
