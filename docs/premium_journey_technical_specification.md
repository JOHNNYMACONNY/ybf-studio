# Premium Journey Technical Specification

> **Technical Note:** This document provides detailed technical specifications for implementing premium journey features. All implementations must follow the [Best Practices](./best_practices.md) and integrate with existing [Component Map](./component_map.md) patterns.

**Related Docs:** [Premium Journey Implementation Plan](./premium_journey_implementation_plan.md) | [Component Map](./component_map.md) | [Database Schema](./database/) | [API Documentation](./api/)

---

## Purpose
This document provides detailed technical specifications for implementing the premium journey features, including component architecture, API design, database schema, and integration requirements.

---

## Table of Contents
- [System Architecture](#system-architecture)
- [Component Specifications](#component-specifications)
- [API Design](#api-design)
- [Database Schema](#database-schema)
- [Integration Requirements](#integration-requirements)
- [Performance Considerations](#performance-considerations)
- [Security Requirements](#security-requirements)
- [Testing Strategy](#testing-strategy)

---

## System Architecture

### **High-Level Architecture**
```
Frontend (Next.js) → API Routes → Database (Supabase) → External Services
     ↓                    ↓              ↓                    ↓
Premium Components → Consultation API → PostgreSQL → Calendly/Email
```

### **Component Hierarchy**
```
Premium Journey System
├── Consultation System
│   ├── ConsultationBookingModal
│   ├── ConsultationConfirmation
│   └── ConsultationManagement
├── Sample Mix System
│   ├── SampleMixRequest
│   ├── SampleMixUpload
│   └── SampleMixDelivery
├── Enhanced Booking
│   ├── PremiumServiceBookingModal
│   ├── ProjectSetupWizard
│   └── EnhancedProjectForm
└── Project Management
    ├── ClientProjectDashboard
    ├── ProjectStatusTracker
    └── CommunicationPortal
```

### **Data Flow**
```
1. User Interaction → Component State Update
2. Component → API Route → Database
3. Database → External Service Integration
4. External Service → Email/Notification
5. User Receives Confirmation/Update
```

---

## Component Specifications

### **1. ConsultationBookingModal.tsx**

#### **Purpose**
Primary interface for users to book free consultations and provide project details.

#### **Props Interface**
```typescript
interface ConsultationBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service; // Optional: pre-selected service
  onSuccess?: (consultationId: string) => void;
}
```

#### **State Management**
```typescript
interface ConsultationFormState {
  projectName: string;
  projectDescription: string;
  genre: string;
  bpm: string;
  referenceTracks: string[];
  consultationDate: Date | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  specialRequirements: string;
}
```

#### **Key Features**
- **Project Details Form**: Comprehensive project information collection
- **Calendly Integration**: Embedded calendar for consultation scheduling
- **File Upload**: Reference track upload capability
- **Form Validation**: Client-side and server-side validation
- **Success Handling**: Confirmation and next steps

#### **Integration Points**
- **Calendly API**: For consultation scheduling
- **File Upload API**: For reference track storage
- **Email Service**: For confirmation emails
- **Database**: For consultation record storage

### **2. SampleMixRequest.tsx**

#### **Purpose**
Interface for users to request free 30-second sample mixes of their work.

#### **Props Interface**
```typescript
interface SampleMixRequestProps {
  consultationId?: string; // Optional: linked consultation
  onSuccess?: (sampleMixId: string) => void;
  onError?: (error: string) => void;
}
```

#### **State Management**
```typescript
interface SampleMixFormState {
  originalAudioFile: File | null;
  projectName: string;
  genre: string;
  mixingPreferences: string;
  customerName: string;
  customerEmail: string;
  consultationId?: string;
}
```

#### **Key Features**
- **Audio Upload**: Drag-and-drop file upload for 30-second sections
- **Project Context**: Links to consultation if available
- **Mixing Preferences**: User input for mixing direction
- **Progress Tracking**: Upload and processing status
- **Usage Guidelines**: Clear limitations and expectations

#### **File Upload Requirements**
- **Supported Formats**: WAV, AIFF, MP3 (24-bit WAV preferred)
- **File Size Limit**: 50MB maximum
- **Duration Limit**: 30 seconds maximum
- **Quality Requirements**: Minimum 44.1kHz, 16-bit

### **3. PremiumServiceBookingModal.tsx**

#### **Purpose**
Enhanced service booking modal that integrates consultation and sample mix data.

#### **Props Interface**
```typescript
interface PremiumServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  consultationId?: string;
  sampleMixId?: string;
  onSuccess?: (serviceRequestId: string) => void;
}
```

#### **State Management**
```typescript
interface PremiumBookingState {
  selectedService: Service;
  consultationData?: ConsultationData;
  sampleMixData?: SampleMixData;
  projectFiles: File[];
  projectNotes: string;
  specialInstructions: string;
  customerName: string;
  customerEmail: string;
  projectName: string;
  projectDescription: string;
}
```

#### **Key Features**
- **Consultation Integration**: Display consultation summary and recommendations
- **Sample Mix Results**: Show sample mix quality and user feedback
- **Enhanced Project Form**: Comprehensive project setup
- **Service Recommendations**: AI-powered service suggestions
- **Pricing Calculator**: Dynamic pricing based on project scope

### **4. ClientProjectDashboard.tsx**

#### **Purpose**
Client-facing dashboard for project tracking, file management, and communication.

#### **Props Interface**
```typescript
interface ClientProjectDashboardProps {
  userId: string;
  projectId?: string; // Optional: specific project focus
}
```

#### **State Management**
```typescript
interface DashboardState {
  projects: Project[];
  activeProject?: Project;
  notifications: Notification[];
  files: ProjectFile[];
  messages: CommunicationMessage[];
}
```

#### **Key Features**
- **Project Overview**: Status, timeline, and progress tracking
- **File Management**: Upload, download, and version control
- **Communication Portal**: Direct messaging with engineers
- **Status Updates**: Real-time project progress notifications
- **Revision Tracking**: Version history and feedback management

---

## API Design

### **1. Consultation Management API**

#### **POST /api/consultations**
**Purpose**: Create new consultation request

**Request Body**:
```typescript
interface CreateConsultationRequest {
  projectName: string;
  projectDescription: string;
  genre: string;
  bpm: string;
  referenceTracks: string[];
  consultationDate: Date;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  specialRequirements: string;
}
```

**Response**:
```typescript
interface CreateConsultationResponse {
  success: boolean;
  consultationId: string;
  calendlyUrl: string;
  confirmationEmail: string;
  error?: string;
}
```

#### **GET /api/consultations/:id**
**Purpose**: Retrieve consultation details

**Response**:
```typescript
interface ConsultationDetails {
  id: string;
  projectName: string;
  projectDescription: string;
  genre: string;
  bpm: string;
  referenceTracks: string[];
  consultationDate: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  specialRequirements: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### **2. Sample Mix API**

#### **POST /api/sample-mixes**
**Purpose**: Create sample mix request

**Request Body**:
```typescript
interface CreateSampleMixRequest {
  originalAudioFile: File;
  projectName: string;
  genre: string;
  mixingPreferences: string;
  customerName: string;
  customerEmail: string;
  consultationId?: string;
}
```

**Response**:
```typescript
interface CreateSampleMixResponse {
  success: boolean;
  sampleMixId: string;
  uploadUrl: string;
  estimatedDelivery: Date;
  error?: string;
}
```

#### **GET /api/sample-mixes/:id**
**Purpose**: Retrieve sample mix status and results

**Response**:
```typescript
interface SampleMixDetails {
  id: string;
  originalAudioUrl: string;
  sampleMixUrl?: string;
  status: 'pending' | 'processing' | 'delivered';
  projectName: string;
  genre: string;
  mixingPreferences: string;
  customerName: string;
  customerEmail: string;
  consultationId?: string;
  estimatedDelivery: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### **3. Project Management API**

#### **POST /api/projects**
**Purpose**: Create new project from consultation and sample mix

**Request Body**:
```typescript
interface CreateProjectRequest {
  consultationId: string;
  sampleMixId?: string;
  serviceId: string;
  projectFiles: File[];
  projectNotes: string;
  specialInstructions: string;
  customerName: string;
  customerEmail: string;
  projectName: string;
  projectDescription: string;
}
```

**Response**:
```typescript
interface CreateProjectResponse {
  success: boolean;
  projectId: string;
  serviceRequestId: string;
  checkoutUrl: string;
  error?: string;
}
```

#### **GET /api/projects/:id**
**Purpose**: Retrieve project details and status

**Response**:
```typescript
interface ProjectDetails {
  id: string;
  consultationId: string;
  sampleMixId?: string;
  serviceRequestId: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed';
  projectFiles: ProjectFile[];
  projectNotes: string;
  specialInstructions: string;
  timeline: ProjectTimeline;
  customerName: string;
  customerEmail: string;
  projectName: string;
  projectDescription: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Database Schema

### **New Tables**

#### **1. consultations**
```sql
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    project_name TEXT NOT NULL,
    project_description TEXT,
    genre TEXT,
    bpm TEXT,
    reference_tracks JSONB DEFAULT '[]',
    consultation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    notes TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    special_requirements TEXT,
    calendly_event_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_consultation_date ON consultations(consultation_date);
CREATE INDEX idx_consultations_customer_email ON consultations(customer_email);
```

#### **2. sample_mixes**
```sql
CREATE TABLE sample_mixes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
    original_audio_url TEXT NOT NULL,
    sample_mix_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'delivered')),
    project_name TEXT NOT NULL,
    genre TEXT,
    mixing_preferences TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sample_mixes_user_id ON sample_mixes(user_id);
CREATE INDEX idx_sample_mixes_consultation_id ON sample_mixes(consultation_id);
CREATE INDEX idx_sample_mixes_status ON sample_mixes(status);
CREATE INDEX idx_sample_mixes_customer_email ON sample_mixes(customer_email);
```

#### **3. projects**
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
    sample_mix_id UUID REFERENCES sample_mixes(id) ON DELETE SET NULL,
    service_request_id UUID REFERENCES service_requests(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'completed')),
    project_files JSONB DEFAULT '[]',
    project_notes TEXT,
    special_instructions TEXT,
    timeline JSONB DEFAULT '{}',
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    project_name TEXT NOT NULL,
    project_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_consultation_id ON projects(consultation_id);
CREATE INDEX idx_projects_sample_mix_id ON projects(sample_mix_id);
CREATE INDEX idx_projects_service_request_id ON projects(service_request_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_customer_email ON projects(customer_email);
```

### **Schema Updates**

#### **1. service_requests table enhancement**
```sql
-- Add new columns to existing service_requests table
ALTER TABLE service_requests 
ADD COLUMN consultation_id UUID REFERENCES consultations(id),
ADD COLUMN sample_mix_id UUID REFERENCES sample_mixes(id),
ADD COLUMN project_id UUID REFERENCES projects(id);

-- Add indexes
CREATE INDEX idx_service_requests_consultation_id ON service_requests(consultation_id);
CREATE INDEX idx_service_requests_sample_mix_id ON service_requests(sample_mix_id);
CREATE INDEX idx_service_requests_project_id ON service_requests(project_id);
```

---

## Integration Requirements

### **1. Calendly Integration**

#### **Setup Requirements**
- **Calendly API Key**: Required for programmatic access
- **Webhook Configuration**: For real-time consultation updates
- **Event Type Configuration**: 15-minute consultation slots
- **Calendar Integration**: Google Calendar or Outlook sync

#### **API Integration**
```typescript
// Calendly API client setup
const calendlyClient = new CalendlyClient({
  apiKey: process.env.CALENDLY_API_KEY,
  baseURL: 'https://api.calendly.com'
});

// Create consultation event
const createConsultationEvent = async (consultationData: ConsultationData) => {
  const event = await calendlyClient.schedulingLinks.create({
    owner: process.env.CALENDLY_USER_URI,
    eventType: process.env.CALENDLY_CONSULTATION_EVENT_TYPE,
    maxEventCount: 1,
    active: true
  });
  
  return event.uri;
};
```

### **2. File Upload System**

#### **Storage Requirements**
- **Cloud Storage**: AWS S3 or Cloudinary for file storage
- **File Processing**: Audio file validation and processing
- **CDN Integration**: Fast file delivery worldwide
- **Security**: Signed URLs and access control

#### **Upload Implementation**
```typescript
// File upload handler
const handleFileUpload = async (file: File, type: 'reference' | 'sample' | 'project') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

### **3. Email System Enhancement**

#### **Current System**
- **SendGrid Integration**: Already implemented
- **Email Templates**: Basic confirmation emails

#### **Enhancement Requirements**
- **Consultation Confirmation**: Professional consultation booking emails
- **Sample Mix Delivery**: Sample mix completion notifications
- **Project Updates**: Regular project status updates
- **Follow-up Sequences**: Post-completion follow-up emails

#### **Email Template Structure**
```typescript
interface EmailTemplate {
  consultationConfirmation: {
    subject: string;
    body: string;
    variables: string[];
  };
  sampleMixDelivery: {
    subject: string;
    body: string;
    variables: string[];
  };
  projectUpdate: {
    subject: string;
    body: string;
    variables: string[];
  };
}
```

---

## Performance Considerations

### **1. File Upload Optimization**
- **Chunked Uploads**: Large file handling
- **Progress Tracking**: Real-time upload progress
- **Compression**: Audio file optimization
- **Caching**: CDN integration for fast delivery

### **2. Database Performance**
- **Indexing Strategy**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Minimize database load
- **Caching Layer**: Redis for frequently accessed data

### **3. API Performance**
- **Rate Limiting**: Prevent API abuse
- **Response Caching**: Cache static responses
- **Async Processing**: Background job processing
- **Load Balancing**: Handle concurrent requests

---

## Security Requirements

### **1. Authentication & Authorization**
- **User Authentication**: NextAuth.js integration
- **Role-Based Access**: Admin vs. client permissions
- **Session Management**: Secure session handling
- **API Security**: JWT token validation

### **2. File Security**
- **Access Control**: Signed URLs for file access
- **File Validation**: Type and size restrictions
- **Virus Scanning**: Malware protection
- **Encryption**: File encryption at rest

### **3. Data Protection**
- **Input Validation**: XSS and injection prevention
- **Data Encryption**: Sensitive data encryption
- **Audit Logging**: User action tracking
- **GDPR Compliance**: Data privacy compliance

---

## Testing Strategy

### **1. Unit Testing**
- **Component Testing**: React component testing with Jest
- **API Testing**: API endpoint testing
- **Utility Testing**: Helper function testing
- **Mock Testing**: External service mocking

### **2. Integration Testing**
- **API Integration**: End-to-end API testing
- **Database Integration**: Database operation testing
- **External Services**: Calendly and email integration testing
- **File Upload**: File processing workflow testing

### **3. User Experience Testing**
- **Usability Testing**: User flow validation
- **Performance Testing**: Load and stress testing
- **Accessibility Testing**: WCAG compliance testing
- **Cross-Browser Testing**: Browser compatibility testing

### **4. Test Coverage Targets**
- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ coverage
- **User Experience Tests**: 100% of critical paths
- **Performance Tests**: Load testing under expected traffic

---

## Implementation Checklist

### **Phase 1: Foundation (Week 1-2)**
- [ ] Database schema creation and migration
- [ ] Calendly API integration setup
- [ ] Basic consultation API endpoints
- [ ] Consultation booking modal component
- [ ] Email template creation

### **Phase 2: Sample Mix System (Week 3-4)**
- [ ] File upload system implementation
- [ ] Sample mix API endpoints
- [ ] Sample mix request component
- [ ] Audio processing workflow
- [ ] Sample mix delivery system

### **Phase 3: Enhanced Booking (Week 5)**
- [ ] Premium service booking modal
- [ ] Consultation and sample mix integration
- [ ] Enhanced project setup form
- [ ] Service recommendation system
- [ ] Dynamic pricing calculator

### **Phase 4: Project Management (Week 6)**
- [ ] Client project dashboard
- [ ] Project status tracking
- [ ] Communication portal
- [ ] File management system
- [ ] Notification system

### **Final Testing & Deployment**
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] User acceptance testing
- [ ] Production deployment

---

## Conclusion

This technical specification provides the detailed implementation requirements for the premium journey features. The modular approach ensures maintainable code while the comprehensive testing strategy guarantees quality delivery.

**Key Implementation Principles:**
1. **Modular Architecture**: Reusable components and services
2. **Performance First**: Optimized for speed and scalability
3. **Security Focus**: Comprehensive security measures
4. **Quality Assurance**: Thorough testing at every level

**Next Steps:**
1. **Review and Approve**: Technical team review of specifications
2. **Resource Planning**: Development team allocation
3. **Timeline Validation**: Implementation schedule confirmation
4. **Development Start**: Begin Phase 1 implementation

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Technical Review Required**: [Development Team]  
**Implementation Start**: [Approved Date]
