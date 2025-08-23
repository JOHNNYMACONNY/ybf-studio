# Google Calendar API Integration Guide

> **Integration Note:** This guide provides complete setup and implementation instructions for integrating Google Calendar API with the consultation system. Follow these steps exactly to ensure proper OAuth2 authentication and calendar event management.

**Related Docs:** [Consultation System Implementation Plan](./consultation_system_implementation_plan.md) | [Consultation System Documentation Audit](./consultation_system_documentation_audit.md) | [Environment Configuration Guide](./environment_configuration_guide.md)

---

## Purpose
This guide provides step-by-step instructions for setting up Google Calendar API integration, including OAuth2 authentication, API client configuration, and event management for the consultation booking system.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Google Cloud Console Setup](#google-cloud-console-setup)
- [OAuth2 Configuration](#oauth2-configuration)
- [Environment Configuration](#environment-configuration)
- [API Client Implementation](#api-client-implementation)
- [Calendar Event Management](#calendar-event-management)
- [Error Handling and Fallbacks](#error-handling-and-fallbacks)
- [Testing and Validation](#testing-and-validation)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### **Required Accounts and Access**
- **Google Account**: Personal or business Google account
- **Google Cloud Console Access**: Ability to create and manage projects
- **Domain Verification**: Verified domain ownership (for production)
- **API Quotas**: Understanding of Google Calendar API quotas and limits

### **Technical Requirements**
- **Node.js**: Version 16+ (for Google APIs client library)
- **npm/yarn**: Package manager for dependencies
- **Environment Variables**: Secure storage for API credentials
- **HTTPS**: Required for OAuth2 redirect URIs

### **API Quotas and Limits**
- **Calendar API Queries**: 1,000,000 queries per day
- **Calendar API Writes**: 10,000 writes per day
- **User Rate Limits**: 100 requests per 100 seconds per user
- **Quota Exceeded**: 429 error with retry-after header

---

## Google Cloud Console Setup

### **Step 1: Create Google Cloud Project**

1. **Navigate to Google Cloud Console**
   - Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create New Project**
   - Click "Select a project" → "New Project"
   - **Project Name**: `AudioServiceApp-Consultations` (or your preferred name)
   - **Project ID**: Auto-generated (e.g., `audioserviceapp-consultations-123456`)
   - **Organization**: Select your organization (if applicable)
   - Click "Create"

3. **Set Project as Active**
   - Select the newly created project from the project dropdown
   - Verify you're working in the correct project

### **Step 2: Enable Google Calendar API**

1. **Navigate to APIs & Services**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click on "Google Calendar API"

2. **Enable the API**
   - Click "Enable" button
   - Wait for the API to be enabled
   - You'll see a green checkmark when complete

3. **Verify API Status**
   - Go to "APIs & Services" → "Enabled APIs"
   - Confirm "Google Calendar API" is listed and enabled

### **Step 3: Configure OAuth Consent Screen**

1. **Navigate to OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Click "Configure Consent Screen"

2. **User Type Selection**
   - **User Type**: Select "External" (unless you have Google Workspace)
   - Click "Create"

3. **App Information**
   - **App name**: `AudioServiceApp Consultations`
   - **User support email**: Your support email address
   - **App logo**: Upload your app logo (optional)
   - **App domain**: Your domain (e.g., `audioserviceapp.com`)
   - **Developer contact information**: Your email address
   - Click "Save and Continue"

4. **Scopes Configuration**
   - Click "Add or Remove Scopes"
   - Add the following scopes:
     - `https://www.googleapis.com/auth/calendar` (Full access to calendars)
     - `https://www.googleapis.com/auth/calendar.events` (View and edit events)
   - Click "Update"
   - Click "Save and Continue"

5. **Test Users (Development Only)**
   - **Test users**: Add your email address and any test user emails
   - Click "Save and Continue"
   - Click "Back to Dashboard"

---

## OAuth2 Configuration

### **Step 1: Create OAuth2 Credentials**

1. **Navigate to Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"

2. **Application Type Selection**
   - **Application type**: Select "Web application"
   - **Name**: `AudioServiceApp Consultation System`

3. **Authorized Redirect URIs**
   - **Authorized redirect URIs**: Add the following URIs:
     - `http://localhost:3000/api/auth/google/callback` (Development)
     - `https://yourdomain.com/api/auth/google/callback` (Production)
     - `https://yourdomain.com/api/consultations/calendar/callback` (Calendar callback)
   - Click "Create"

4. **Save Credentials**
   - **Client ID**: Copy and save securely
   - **Client Secret**: Copy and save securely
   - **Warning**: Never commit these to version control

### **Step 2: Configure Calendar Access**

1. **Calendar ID Configuration**
   - Go to [Google Calendar](https://calendar.google.com/)
   - Navigate to your calendar settings
   - **Calendar ID**: Copy the calendar ID (usually your email address)
   - **Calendar Name**: Note the calendar name for reference

2. **Calendar Permissions**
   - **Make available for**: Select "Make available to public"
   - **Permission**: Select "See only free/busy (hide details)"
   - **Share with specific people**: Add your service account email (if using service account)

---

## Environment Configuration

### **Required Environment Variables**

Create or update your `.env.local` file with the following variables:

```bash
# Google Calendar API Configuration
GOOGLE_CLIENT_ID=your_oauth2_client_id_here
GOOGLE_CLIENT_SECRET=your_oauth2_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_CALENDAR_ID=your_calendar_id_here

# Google Calendar API Scopes
GOOGLE_CALENDAR_SCOPE=https://www.googleapis.com/auth/calendar
GOOGLE_CALENDAR_EVENTS_SCOPE=https://www.googleapis.com/auth/calendar.events

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Database Configuration (existing)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# SendGrid Configuration (existing)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=your_from_email_here
```

### **Environment Variable Security**

1. **Development Environment**
   - Use `.env.local` for local development
   - Never commit `.env.local` to version control
   - Add `.env.local` to `.gitignore`

2. **Production Environment**
   - Use Vercel environment variables
   - Set variables in Vercel dashboard
   - Use different OAuth2 credentials for production

3. **Environment Variable Validation**
   - Validate all required variables are set
   - Check variable formats and values
   - Verify API credentials are working

---

## API Client Implementation

### **Step 1: Install Dependencies**

```bash
npm install googleapis @google-cloud/local-auth
# or
yarn add googleapis @google-cloud/local-auth
```

### **Step 2: Create Google Calendar Service**

Create `lib/googleCalendar.ts`:

```typescript
import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Google Calendar API configuration
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

// Calendar ID from environment
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

// OAuth2 client configuration
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Google Calendar API client
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Interface for consultation event data
interface ConsultationEventData {
  projectName: string;
  customerName: string;
  customerEmail: string;
  consultationDate: string;
  duration: number; // in minutes
  description: string;
  location: string; // call type: phone, zoom, google_meet
}

// Google Calendar service class
export class GoogleCalendarService {
  private client: OAuth2Client;
  private calendar: calendar_v3.Calendar;

  constructor() {
    this.client = oauth2Client;
    this.calendar = calendar;
  }

  // Set OAuth2 credentials (called after authentication)
  setCredentials(tokens: any) {
    this.client.setCredentials(tokens);
  }

  // Check if client is authenticated
  isAuthenticated(): boolean {
    const credentials = this.client.credentials;
    return !!(credentials.access_token && credentials.expiry_date && credentials.expiry_date > Date.now());
  }

  // Create consultation event
  async createConsultationEvent(eventData: ConsultationEventData): Promise<string> {
    try {
      // Validate input data
      if (!eventData.consultationDate || !eventData.customerName) {
        throw new Error('Missing required event data');
      }

      // Parse consultation date
      const startDate = new Date(eventData.consultationDate);
      const endDate = new Date(startDate.getTime() + eventData.duration * 60000);

      // Create event object
      const event: calendar_v3.Schema$Event = {
        summary: `Consultation: ${eventData.projectName}`,
        description: eventData.description,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        attendees: [
          { email: eventData.customerEmail, displayName: eventData.customerName }
        ],
        location: eventData.location,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours
            { method: 'popup', minutes: 15 }, // 15 minutes
          ],
        },
        conferenceData: this.getConferenceData(eventData.location),
      };

      // Create event in Google Calendar
      const response = await this.calendar.events.insert({
        calendarId: CALENDAR_ID,
        requestBody: event,
        sendUpdates: 'all', // Send invites to attendees
        conferenceDataVersion: 1, // Enable conference data
      });

      if (!response.data.id) {
        throw new Error('Failed to create calendar event');
      }

      return response.data.id;
    } catch (error) {
      console.error('Error creating consultation event:', error);
      throw new Error(`Failed to create calendar event: ${error.message}`);
    }
  }

  // Get conference data for video calls
  private getConferenceData(location: string): calendar_v3.Schema$ConferenceData | undefined {
    if (location === 'zoom' || location === 'google_meet') {
      return {
        createRequest: {
          requestId: `consultation-${Date.now()}`,
          conferenceSolutionKey: {
            type: location === 'zoom' ? 'hangoutsMeet' : 'hangoutsMeet'
          },
        },
      };
    }
    return undefined;
  }

  // Get available time slots
  async getAvailableTimeSlots(date: string, duration: number = 15): Promise<string[]> {
    try {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59);

      // Get events for the specified date
      const response = await this.calendar.events.list({
        calendarId: CALENDAR_ID,
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];
      const availableSlots: string[] = [];

      // Define business hours (10:00 AM - 7:00 PM)
      const businessStart = 10; // 10:00 AM
      const businessEnd = 19; // 7:00 PM

      // Generate time slots
      for (let hour = businessStart; hour < businessEnd; hour++) {
        for (let minute = 0; minute < 60; minute += 30) { // 30-minute intervals
          const slotStart = new Date(startDate);
          slotStart.setHours(hour, minute, 0, 0);

          const slotEnd = new Date(slotStart.getTime() + duration * 60000);

          // Check if slot conflicts with existing events
          const hasConflict = events.some(event => {
            if (!event.start?.dateTime || !event.end?.dateTime) return false;
            
            const eventStart = new Date(event.start.dateTime);
            const eventEnd = new Date(event.end.dateTime);
            
            return (slotStart < eventEnd && slotEnd > eventStart);
          });

          if (!hasConflict) {
            availableSlots.push(slotStart.toISOString());
          }
        }
      }

      return availableSlots;
    } catch (error) {
      console.error('Error getting available time slots:', error);
      throw new Error(`Failed to get available time slots: ${error.message}`);
    }
  }

  // Update consultation event
  async updateConsultationEvent(eventId: string, eventData: Partial<ConsultationEventData>): Promise<void> {
    try {
      // Get existing event
      const existingEvent = await this.calendar.events.get({
        calendarId: CALENDAR_ID,
        eventId: eventId,
      });

      if (!existingEvent.data) {
        throw new Error('Event not found');
      }

      // Update event data
      const updatedEvent = {
        ...existingEvent.data,
        ...eventData,
      };

      // Update event in Google Calendar
      await this.calendar.events.update({
        calendarId: CALENDAR_ID,
        eventId: eventId,
        requestBody: updatedEvent,
        sendUpdates: 'all',
      });
    } catch (error) {
      console.error('Error updating consultation event:', error);
      throw new Error(`Failed to update calendar event: ${error.message}`);
    }
  }

  // Delete consultation event
  async deleteConsultationEvent(eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId: CALENDAR_ID,
        eventId: eventId,
        sendUpdates: 'all',
      });
    } catch (error) {
      console.error('Error deleting consultation event:', error);
      throw new Error(`Failed to delete calendar event: ${error.message}`);
    }
  }

  // Get event details
  async getEventDetails(eventId: string): Promise<calendar_v3.Schema$Event | null> {
    try {
      const response = await this.calendar.events.get({
        calendarId: CALENDAR_ID,
        eventId: eventId,
      });

      return response.data;
    } catch (error) {
      console.error('Error getting event details:', error);
      return null;
    }
  }
}

// Export singleton instance
export const googleCalendarService = new GoogleCalendarService();
```

### **Step 3: Create OAuth2 Authentication Handler**

Create `pages/api/auth/google/callback.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { googleCalendarService } from '../../../lib/googleCalendar';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange authorization code for tokens
    const { tokens } = await googleCalendarService.client.getToken(code);
    
    // Set credentials for the service
    googleCalendarService.setCredentials(tokens);

    // Store tokens securely (implement your token storage strategy)
    // For now, we'll store in session or database
    // TODO: Implement secure token storage

    // Redirect to success page or consultation form
    res.redirect('/consultation/success?auth=success');
  } catch (error) {
    console.error('OAuth2 callback error:', error);
    res.redirect('/consultation/error?auth=failed');
  }
}
```

---

## Calendar Event Management

### **Step 1: Create Consultation Event API**

Create `pages/api/consultations/calendar/event.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { googleCalendarService } from '../../../../lib/googleCalendar';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Create consultation event
    try {
      const {
        projectName,
        customerName,
        customerEmail,
        consultationDate,
        duration = 15,
        description,
        location = 'call'
      } = req.body;

      // Validate required fields
      if (!projectName || !customerName || !customerEmail || !consultationDate) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['projectName', 'customerName', 'customerEmail', 'consultationDate']
        });
      }

      // Check if service is authenticated
      if (!googleCalendarService.isAuthenticated()) {
        return res.status(401).json({
          error: 'Google Calendar service not authenticated',
          action: 'redirect_to_auth'
        });
      }

      // Create event data
      const eventData = {
        projectName,
        customerName,
        customerEmail,
        consultationDate,
        duration,
        description: description || `Consultation for ${projectName}`,
        location
      };

      // Create calendar event
      const eventId = await googleCalendarService.createConsultationEvent(eventData);

      res.status(201).json({
        success: true,
        eventId,
        message: 'Consultation event created successfully'
      });
    } catch (error) {
      console.error('Error creating consultation event:', error);
      res.status(500).json({
        error: 'Failed to create consultation event',
        message: error.message
      });
    }
  } else if (req.method === 'GET') {
    // Get available time slots
    try {
      const { date, duration = 15 } = req.query;

      if (!date || typeof date !== 'string') {
        return res.status(400).json({
          error: 'Date parameter is required'
        });
      }

      // Check if service is authenticated
      if (!googleCalendarService.isAuthenticated()) {
        return res.status(401).json({
          error: 'Google Calendar service not authenticated',
          action: 'redirect_to_auth'
        });
      }

      // Get available time slots
      const availableSlots = await googleCalendarService.getAvailableTimeSlots(date, Number(duration));

      res.status(200).json({
        success: true,
        availableSlots,
        date,
        duration: Number(duration)
      });
    } catch (error) {
      console.error('Error getting available time slots:', error);
      res.status(500).json({
        error: 'Failed to get available time slots',
        message: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

### **Step 2: Update Consultation Event API**

Create `pages/api/consultations/calendar/event/[id].ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { googleCalendarService } from '../../../../../lib/googleCalendar';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  if (req.method === 'PUT') {
    // Update consultation event
    try {
      const updateData = req.body;

      // Check if service is authenticated
      if (!googleCalendarService.isAuthenticated()) {
        return res.status(401).json({
          error: 'Google Calendar service not authenticated',
          action: 'redirect_to_auth'
        });
      }

      // Update event
      await googleCalendarService.updateConsultationEvent(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Consultation event updated successfully'
      });
    } catch (error) {
      console.error('Error updating consultation event:', error);
      res.status(500).json({
        error: 'Failed to update consultation event',
        message: error.message
      });
    }
  } else if (req.method === 'DELETE') {
    // Delete consultation event
    try {
      // Check if service is authenticated
      if (!googleCalendarService.isAuthenticated()) {
        return res.status(401).json({
          error: 'Google Calendar service not authenticated',
          action: 'redirect_to_auth'
        });
      }

      // Delete event
      await googleCalendarService.deleteConsultationEvent(id);

      res.status(200).json({
        success: true,
        message: 'Consultation event deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting consultation event:', error);
      res.status(500).json({
        error: 'Failed to delete consultation event',
        message: error.message
      });
    }
  } else if (req.method === 'GET') {
    // Get event details
    try {
      const eventDetails = await googleCalendarService.getEventDetails(id);

      if (!eventDetails) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.status(200).json({
        success: true,
        event: eventDetails
      });
    } catch (error) {
      console.error('Error getting event details:', error);
      res.status(500).json({
        error: 'Failed to get event details',
        message: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

---

## Error Handling and Fallbacks

### **Error Handling Strategy**

1. **Authentication Errors**
   - Redirect to OAuth2 flow
   - Clear invalid tokens
   - Log authentication failures

2. **API Rate Limiting**
   - Implement exponential backoff
   - Queue requests when rate limited
   - Monitor quota usage

3. **Network Errors**
   - Retry with exponential backoff
   - Fallback to manual scheduling
   - Log network failures

### **Fallback Implementation**

```typescript
// Fallback service when Google Calendar is unavailable
export class FallbackCalendarService {
  async createConsultationEvent(eventData: ConsultationEventData): Promise<string> {
    // Store event in local database
    // Send email confirmation with manual scheduling
    // Return local event ID
    const localEventId = `local-${Date.now()}`;
    
    // TODO: Implement local event storage
    // TODO: Send manual scheduling email
    
    return localEventId;
  }

  async getAvailableTimeSlots(date: string, duration: number = 15): Promise<string[]> {
    // Return predefined business hours
    // This is a fallback when Google Calendar is unavailable
    const businessHours = this.generateBusinessHours(date);
    return businessHours;
  }

  private generateBusinessHours(date: string): string[] {
    const slots: string[] = [];
    const baseDate = new Date(date);
    
    // Generate slots from 10:00 AM to 7:00 PM
    for (let hour = 10; hour < 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotDate = new Date(baseDate);
        slotDate.setHours(hour, minute, 0, 0);
        slots.push(slotDate.toISOString());
      }
    }
    
    return slots;
  }
}
```

---

## Testing and Validation

### **Unit Testing**

```typescript
// __tests__/googleCalendar.test.ts
import { GoogleCalendarService } from '../lib/googleCalendar';

describe('GoogleCalendarService', () => {
  let service: GoogleCalendarService;

  beforeEach(() => {
    service = new GoogleCalendarService();
  });

  describe('createConsultationEvent', () => {
    it('should create consultation event with valid data', async () => {
      const eventData = {
        projectName: 'Test Project',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        consultationDate: new Date().toISOString(),
        duration: 15,
        description: 'Test consultation',
        location: 'call'
      };

      // Mock Google Calendar API response
      // TODO: Implement proper mocking

      const eventId = await service.createConsultationEvent(eventData);
      expect(eventId).toBeDefined();
    });

    it('should throw error with missing required data', async () => {
      const eventData = {
        projectName: '',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        consultationDate: new Date().toISOString(),
        duration: 15,
        description: 'Test consultation',
        location: 'call'
      };

      await expect(service.createConsultationEvent(eventData))
        .rejects
        .toThrow('Missing required event data');
    });
  });

  describe('getAvailableTimeSlots', () => {
    it('should return available time slots for business hours', async () => {
      const date = new Date().toISOString().split('T')[0];
      const slots = await service.getAvailableTimeSlots(date, 15);

      expect(slots).toBeInstanceOf(Array);
      expect(slots.length).toBeGreaterThan(0);
    });
  });
});
```

### **Integration Testing**

```typescript
// __tests__/api/consultations/calendar.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '../../../pages/api/consultations/calendar/event';

describe('/api/consultations/calendar/event', () => {
  it('should create consultation event', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        projectName: 'Test Project',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        consultationDate: new Date().toISOString(),
        duration: 15,
        description: 'Test consultation',
        location: 'call'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.eventId).toBeDefined();
  });

  it('should return 400 for missing required fields', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        projectName: 'Test Project',
        // Missing required fields
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Missing required fields');
  });
});
```

---

## Production Deployment

### **Vercel Environment Variables**

Set the following environment variables in your Vercel dashboard:

```bash
# Google Calendar API
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
GOOGLE_CALENDAR_ID=your_production_calendar_id

# Application Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_production_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com
```

### **Production OAuth2 Configuration**

1. **Update OAuth2 Consent Screen**
   - Change user type to "Production"
   - Submit for verification (if required)
   - Add production domain to authorized domains

2. **Update Redirect URIs**
   - Remove development URIs
   - Add production URIs only
   - Verify domain ownership

3. **API Quotas**
   - Monitor API usage
   - Set up alerts for quota limits
   - Implement rate limiting if needed

---

## Troubleshooting

### **Common Issues and Solutions**

1. **OAuth2 Authentication Failed**
   - Verify client ID and secret
   - Check redirect URI configuration
   - Ensure OAuth consent screen is configured

2. **Calendar API Quota Exceeded**
   - Monitor API usage
   - Implement caching for repeated requests
   - Use fallback service when needed

3. **Event Creation Failed**
   - Verify calendar ID
   - Check event data validation
   - Ensure proper authentication

4. **Timezone Issues**
   - Use client timezone for event creation
   - Validate date/time formats
   - Test with different timezones

### **Debug Mode**

Enable debug logging by setting environment variable:

```bash
DEBUG=googleapis:*
```

### **Support Resources**

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Google Cloud Console Help](https://cloud.google.com/docs)
- [OAuth2 Best Practices](https://developers.google.com/identity/protocols/oauth2)
- [API Quotas and Limits](https://developers.google.com/calendar/api/quotas)

---

## Conclusion

This Google Calendar API integration guide provides complete setup and implementation instructions for the consultation system. Follow these steps carefully to ensure proper OAuth2 authentication and calendar event management.

**Key Success Factors**:
1. **Proper OAuth2 Configuration**: Follow the setup steps exactly
2. **Environment Variable Management**: Secure storage of API credentials
3. **Error Handling**: Implement comprehensive error handling and fallbacks
4. **Testing**: Thorough testing before production deployment
5. **Monitoring**: Monitor API usage and implement rate limiting

**Next Steps**:
1. Complete Google Cloud Console setup
2. Configure OAuth2 credentials
3. Set environment variables
4. Implement API client code
5. Test integration thoroughly
6. Deploy to production

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [After Implementation]  
**Implementation Status**: [Ready for Development]
