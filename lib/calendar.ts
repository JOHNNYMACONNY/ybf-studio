import { Consultation, ConsultationPackage } from './consultation';

export interface CalendarEvent {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string[];
}

export interface GoogleCalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: string;
  attendees?: Array<{ email: string }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
}

export interface OutlookCalendarEvent {
  subject: string;
  body: {
    contentType: 'HTML' | 'Text';
    content: string;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName: string;
  };
  attendees?: Array<{
    emailAddress: {
      address: string;
      name: string;
    };
    type: 'required' | 'optional';
  }>;
}

export class CalendarService {
  private static readonly TIMEZONE = 'America/New_York'; // Default timezone, can be made configurable

  /**
   * Generate a Google Calendar link for a consultation
   */
  static generateGoogleCalendarLink(consultation: Consultation, packageDetails?: ConsultationPackage): string {
    const startTime = new Date(consultation.start_at);
    const endTime = new Date(consultation.end_at);
    
    const event: GoogleCalendarEvent = {
      summary: `Consultation: ${packageDetails?.name || 'Audio Service Consultation'}`,
      description: this.generateEventDescription(consultation, packageDetails),
      start: {
        dateTime: startTime.toISOString(),
        timeZone: this.TIMEZONE
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: this.TIMEZONE
      },
      location: consultation.meeting_link || 'TBD',
      attendees: [
        { email: consultation.client_id } // This will be replaced with actual client email
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 1440 }, // 24 hours
          { method: 'popup', minutes: 60 }   // 1 hour
        ]
      }
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.summary,
      dates: `${this.formatGoogleCalendarDate(startTime)}/${this.formatGoogleCalendarDate(endTime)}`,
      details: event.description,
      location: event.location || '',
      ctz: this.TIMEZONE
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  /**
   * Generate an Outlook Calendar link for a consultation
   */
  static generateOutlookCalendarLink(consultation: Consultation, packageDetails?: ConsultationPackage): string {
    const startTime = new Date(consultation.start_at);
    const endTime = new Date(consultation.end_at);
    
    const event: OutlookCalendarEvent = {
      subject: `Consultation: ${packageDetails?.name || 'Audio Service Consultation'}`,
      body: {
        contentType: 'HTML',
        content: this.generateEventDescription(consultation, packageDetails)
      },
      start: {
        dateTime: startTime.toISOString(),
        timeZone: this.TIMEZONE
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: this.TIMEZONE
      },
      location: {
        displayName: consultation.meeting_link || 'TBD'
      },
      attendees: [
        {
          emailAddress: {
            address: consultation.client_id, // This will be replaced with actual client email
            name: 'Client'
          },
          type: 'required'
        }
      ]
    };

    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: event.subject,
      startdt: startTime.toISOString(),
      enddt: endTime.toISOString(),
      body: event.body.content,
      location: event.location?.displayName || '',
      allday: 'false'
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  }

  /**
   * Generate an iCal file content for a consultation
   */
  static generateICalContent(consultation: Consultation, packageDetails?: ConsultationPackage): string {
    const startTime = new Date(consultation.start_at);
    const endTime = new Date(consultation.end_at);
    const now = new Date();
    
    const event = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AudioServiceApp//Consultation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${consultation.id}@audioserviceapp.com`,
      `DTSTAMP:${this.formatICalDate(now)}`,
      `DTSTART:${this.formatICalDate(startTime)}`,
      `DTEND:${this.formatICalDate(endTime)}`,
      `SUMMARY:Consultation: ${packageDetails?.name || 'Audio Service Consultation'}`,
      `DESCRIPTION:${this.generateEventDescription(consultation, packageDetails).replace(/\n/g, '\\n')}`,
      `LOCATION:${consultation.meeting_link || 'TBD'}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-PT1H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Consultation reminder',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    return event;
  }

  /**
   * Generate a calendar event description
   */
  private static generateEventDescription(consultation: Consultation, packageDetails?: ConsultationPackage): string {
    let description = '';
    
    if (packageDetails) {
      description += `Package: ${packageDetails.name}\n`;
      description += `Duration: ${packageDetails.duration_minutes} minutes\n`;
      if (packageDetails.description) {
        description += `Description: ${packageDetails.description}\n`;
      }
      if (packageDetails.features && packageDetails.features.length > 0) {
        description += `Features:\n${packageDetails.features.map(f => `• ${f}`).join('\n')}\n`;
      }
    }
    
    if (consultation.notes) {
      description += `\nNotes: ${consultation.notes}\n`;
    }
    
    description += `\nMeeting Link: ${consultation.meeting_link || 'TBD'}\n`;
    description += `\nPlease ensure you have a stable internet connection and are in a quiet environment for the consultation.`;
    
    return description;
  }

  /**
   * Format date for Google Calendar URL
   */
  private static formatGoogleCalendarDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  /**
   * Format date for iCal
   */
  private static formatICalDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  /**
   * Calculate end time based on start time and duration
   */
  static calculateEndTime(startTime: string, durationMinutes: number): string {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    return end.toISOString();
  }

  /**
   * Check if a time slot is available (basic validation)
   */
  static isTimeSlotAvailable(startTime: string, endTime: string, existingConsultations: Consultation[]): boolean {
    const requestedStart = new Date(startTime);
    const requestedEnd = new Date(endTime);
    
    // Check for conflicts with existing consultations
    for (const consultation of existingConsultations) {
      if (consultation.status === 'cancelled' || consultation.status === 'completed') {
        continue;
      }
      
      const existingStart = new Date(consultation.start_at);
      const existingEnd = new Date(consultation.end_at);
      
      // Check for overlap
      if (requestedStart < existingEnd && requestedEnd > existingStart) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Get available time slots for a given date
   */
  static getAvailableTimeSlots(
    date: string,
    durationMinutes: number,
    existingConsultations: Consultation[],
    businessHours: { start: string; end: string } = { start: '09:00', end: '17:00' }
  ): string[] {
    const availableSlots: string[] = [];
    const targetDate = new Date(date);
    const [startHour, startMinute] = businessHours.start.split(':').map(Number);
    const [endHour, endMinute] = businessHours.end.split(':').map(Number);
    
    const dayStart = new Date(targetDate);
    dayStart.setHours(startHour, startMinute, 0, 0);
    
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(endHour, endMinute, 0, 0);
    
    // Generate 30-minute slots
    const slotDuration = 30; // minutes
    let currentSlot = new Date(dayStart);
    
    while (currentSlot < dayEnd) {
      const slotEnd = new Date(currentSlot.getTime() + durationMinutes * 60000);
      
      if (slotEnd <= dayEnd) {
        const isAvailable = this.isTimeSlotAvailable(
          currentSlot.toISOString(),
          slotEnd.toISOString(),
          existingConsultations
        );
        
        if (isAvailable) {
          availableSlots.push(currentSlot.toISOString());
        }
      }
      
      currentSlot = new Date(currentSlot.getTime() + slotDuration * 60000);
    }
    
    return availableSlots;
  }

  /**
   * Format time for display
   */
  static formatTimeForDisplay(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: this.TIMEZONE
    });
  }

  /**
   * Format date for display
   */
  static formatDateForDisplay(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: this.TIMEZONE
    });
  }

  /**
   * Get timezone offset string
   */
  static getTimezoneOffset(): string {
    const date = new Date();
    const offset = -date.getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';
    
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}

