import { supabaseAdmin } from './supabaseAdmin';

export interface Client {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  company?: string;
  project_details?: string;
  budget_range?: string;
  timeline?: string;
  referral_source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ConsultationPackage {
  id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price_cents: number;
  is_active: boolean;
  features?: string[];
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: string;
  client_id: string;
  package_id?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  start_at: string;
  end_at: string;
  duration_minutes: number;
  meeting_link?: string;
  notes?: string;
  admin_notes?: string;
  rescheduled_from?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface ConsultationWithDetails extends Consultation {
  client: Client;
  package?: ConsultationPackage;
}

export interface ConsultationEmail {
  id: string;
  consultation_id: string;
  email_type: 'confirmation' | 'reminder_24h' | 'reminder_1h' | 'reschedule' | 'cancellation' | 'follow_up';
  recipient_email: string;
  subject: string;
  sent_at: string;
  status: 'sent' | 'failed' | 'pending';
  error_message?: string;
}

export interface CreateConsultationData {
  client_email: string;
  client_first_name: string;
  client_last_name: string;
  client_phone?: string;
  client_company?: string;
  project_details?: string;
  budget_range?: string;
  timeline?: string;
  referral_source?: string;
  package_id?: string;
  start_at: string;
  end_at: string;
  duration_minutes: number;
  notes?: string;
}

export interface RescheduleConsultationData {
  start_at: string;
  end_at: string;
  duration_minutes?: number;
  notes?: string;
}

export interface CancelConsultationData {
  reason: string;
  notes?: string;
}

export interface AdminConsultationOverview {
  id: string;
  status: string;
  start_at: string;
  end_at: string;
  duration_minutes: number;
  meeting_link?: string;
  notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  client_email: string;
  client_first_name: string;
  client_last_name: string;
  client_phone?: string;
  client_company?: string;
  package_name?: string;
  package_price_cents?: number;
}

export interface UpcomingConsultation {
  id: string;
  client_email: string;
  client_name: string;
  start_at: string;
  package_name: string;
  meeting_link?: string;
}

// Core consultation functions
export class ConsultationService {
  // Get all consultation packages
  static async getPackages(): Promise<ConsultationPackage[]> {
    const { data, error } = await supabaseAdmin
      .from('consultation_packages')
      .select('*')
      .eq('is_active', true)
      .order('price_cents', { ascending: true });

    if (error) throw new Error(`Failed to fetch consultation packages: ${error.message}`);
    return data || [];
  }

  // Get consultation package by ID
  static async getPackageById(id: string): Promise<ConsultationPackage | null> {
    const { data, error } = await supabaseAdmin
      .from('consultation_packages')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) throw new Error(`Failed to fetch consultation package: ${error.message}`);
    return data;
  }

  // Create or get existing client
  static async getOrCreateClient(clientData: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    company?: string;
    project_details?: string;
    budget_range?: string;
    timeline?: string;
    referral_source?: string;
  }): Promise<Client> {
    // Try to get existing client
    const { data: existingClient, error: fetchError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('email', clientData.email)
      .single();

    if (existingClient) {
      // Update client with new information
      const { data: updatedClient, error: updateError } = await supabaseAdmin
        .from('clients')
        .update({
          first_name: clientData.first_name,
          last_name: clientData.last_name,
          phone: clientData.phone || existingClient.phone,
          company: clientData.company || existingClient.company,
          project_details: clientData.project_details || existingClient.project_details,
          budget_range: clientData.budget_range || existingClient.budget_range,
          timeline: clientData.timeline || existingClient.timeline,
          referral_source: clientData.referral_source || existingClient.referral_source,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingClient.id)
        .select()
        .single();

      if (updateError) throw new Error(`Failed to update client: ${updateError.message}`);
      return updatedClient;
    }

    // Create new client
    const { data: newClient, error: createError } = await supabaseAdmin
      .from('clients')
      .insert([clientData])
      .select()
      .single();

    if (createError) throw new Error(`Failed to create client: ${createError.message}`);
    return newClient;
  }

  // Create consultation
  static async createConsultation(consultationData: CreateConsultationData): Promise<ConsultationWithDetails> {
    // Get or create client
    const client = await this.getOrCreateClient({
      email: consultationData.client_email,
      first_name: consultationData.client_first_name,
      last_name: consultationData.client_last_name,
      phone: consultationData.client_phone,
      company: consultationData.client_company,
      project_details: consultationData.project_details,
      budget_range: consultationData.budget_range,
      timeline: consultationData.timeline,
      referral_source: consultationData.referral_source
    });

    // Create consultation
    const { data: consultation, error: consultationError } = await supabaseAdmin
      .from('consultations')
      .insert([{
        client_id: client.id,
        package_id: consultationData.package_id,
        status: 'scheduled',
        start_at: consultationData.start_at,
        end_at: consultationData.end_at,
        duration_minutes: consultationData.duration_minutes,
        notes: consultationData.notes
      }])
      .select()
      .single();

    if (consultationError) throw new Error(`Failed to create consultation: ${consultationError.message}`);

    // Get package details if package_id exists
    let packageDetails: ConsultationPackage | undefined;
    if (consultationData.package_id) {
      const pkg = await this.getPackageById(consultationData.package_id);
      packageDetails = pkg ?? undefined;
    }

    return {
      ...consultation,
      client,
      package: packageDetails
    };
  }

  // Get consultation by ID with details
  static async getConsultationById(id: string): Promise<ConsultationWithDetails | null> {
    const { data, error } = await supabaseAdmin
      .from('consultations')
      .select(`
        *,
        client:clients(*),
        package:consultation_packages(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(`Failed to fetch consultation: ${error.message}`);
    return data;
  }

  // Get consultations by client email
  static async getConsultationsByClientEmail(email: string): Promise<ConsultationWithDetails[]> {
    const { data, error } = await supabaseAdmin
      .from('consultations')
      .select(`
        *,
        client:clients(*),
        package:consultation_packages(*)
      `)
      .eq('client.email', email)
      .order('start_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch client consultations: ${error.message}`);
    return data || [];
  }

  // Update consultation status
  static async updateConsultationStatus(id: string, status: Consultation['status'], adminNotes?: string): Promise<Consultation> {
    const updateData: Partial<Consultation> & { status: Consultation['status'] } = { status } as const;
    if (adminNotes) (updateData as { admin_notes?: string }).admin_notes = adminNotes;

    const { data, error } = await supabaseAdmin
      .from('consultations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update consultation status: ${error.message}`);
    return data;
  }

  // Reschedule consultation
  static async rescheduleConsultation(id: string, rescheduleData: RescheduleConsultationData): Promise<Consultation> {
    const { data, error } = await supabaseAdmin
      .from('consultations')
      .update({
        start_at: rescheduleData.start_at,
        end_at: rescheduleData.end_at,
        duration_minutes: rescheduleData.duration_minutes || 60,
        notes: rescheduleData.notes,
        status: 'rescheduled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to reschedule consultation: ${error.message}`);
    return data;
  }

  // Cancel consultation
  static async cancelConsultation(id: string, cancelData: CancelConsultationData): Promise<Consultation> {
    const { data, error } = await supabaseAdmin
      .from('consultations')
      .update({
        status: 'cancelled',
        cancellation_reason: cancelData.reason,
        notes: cancelData.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to cancel consultation: ${error.message}`);
    return data;
  }

  // Get admin consultation overview
  static async getAdminConsultationOverview(): Promise<AdminConsultationOverview[]> {
    const { data, error } = await supabaseAdmin
      .from('admin_consultation_overview')
      .select('*')
      .order('start_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch admin consultation overview: ${error.message}`);
    return data || [];
  }

  // Get upcoming consultations
  static async getUpcomingConsultations(hoursAhead: number = 24): Promise<UpcomingConsultation[]> {
    // Fallback implementation without requiring SQL function
    const nowIso = new Date().toISOString();
    const futureIso = new Date(Date.now() + hoursAhead * 60 * 60 * 1000).toISOString();

    // Use admin_consultation_overview view to avoid relationship errors
    const { data, error } = await supabaseAdmin
      .from('admin_consultation_overview')
      .select(`
        id,
        start_at,
        meeting_link,
        client_email,
        client_first_name,
        client_last_name,
        package_name
      `)
      .in('status', ['scheduled', 'confirmed'])
      .gte('start_at', nowIso)
      .lte('start_at', futureIso)
      .order('start_at', { ascending: true });

    if (error) throw new Error(`Failed to fetch upcoming consultations: ${error.message}`);

    const mapped: UpcomingConsultation[] = (data || []).map((row: {
      id: string;
      client_email: string;
      client_first_name?: string;
      client_last_name?: string;
      start_at: string;
      package_name?: string | null;
      meeting_link?: string | null;
    }) => ({
      id: row.id,
      client_email: row.client_email,
      client_name: [row.client_first_name, row.client_last_name].filter(Boolean).join(' '),
      start_at: row.start_at,
      package_name: row.package_name ?? 'Custom Consultation',
      meeting_link: row.meeting_link || undefined,
    }));

    return mapped;
  }

  // Add admin notes to consultation
  static async addAdminNotes(id: string, notes: string): Promise<Consultation> {
    const { data, error } = await supabaseAdmin
      .from('consultations')
      .update({
        admin_notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to add admin notes: ${error.message}`);
    return data;
  }

  // Get consultation statistics
  static async getConsultationStats(): Promise<{
    total: number;
    scheduled: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const { data: totalStats, error: totalError } = await supabaseAdmin
      .from('consultations')
      .select('status, created_at');

    if (totalError) throw new Error(`Failed to fetch consultation statistics: ${totalError.message}`);

    const stats = {
      total: totalStats.length,
      scheduled: totalStats.filter(c => c.status === 'scheduled').length,
      confirmed: totalStats.filter(c => c.status === 'confirmed').length,
      completed: totalStats.filter(c => c.status === 'completed').length,
      cancelled: totalStats.filter(c => c.status === 'cancelled').length,
      thisWeek: totalStats.filter(c => new Date(c.created_at) >= weekStart).length,
      thisMonth: totalStats.filter(c => new Date(c.created_at) >= monthStart).length
    };

    return stats;
  }
}
