import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { ConsultationPackage } from '../../lib/consultation';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (consultation: { id: string; status?: string }) => void;
  onError: (error: string) => void;
};

const defaultDurationOptions = [30, 45, 60, 90, 120];

const ConsultationBookingForm: React.FC<Props> = ({ isOpen, onClose, onSuccess, onError }) => {
  const [packages, setPackages] = useState<ConsultationPackage[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [startAt, setStartAt] = useState(''); // datetime-local string
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [projectDetails, setProjectDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [timeline, setTimeline] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchPackages = async () => {
      try {
        setIsLoadingPackages(true);
        const res = await fetch('/api/consultation-packages');
        if (!res.ok) throw new Error('Failed to load packages');
        const data = await res.json();
        setPackages(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        onError(message);
      } finally {
        setIsLoadingPackages(false);
      }
    };
    fetchPackages();
  }, [isOpen, onError]);

  // Sync duration with selected package when changed
  useEffect(() => {
    if (!selectedPackageId) return;
    const pkg = packages.find(p => p.id === selectedPackageId);
    if (pkg) setDurationMinutes(pkg.duration_minutes);
  }, [selectedPackageId, packages]);

  const durationOptions = useMemo(() => {
    const set = new Set<number>(defaultDurationOptions);
    const pkg = packages.find(p => p.id === selectedPackageId);
    if (pkg) set.add(pkg.duration_minutes);
    return Array.from(set).sort((a, b) => a - b);
  }, [packages, selectedPackageId]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setSelectedPackageId('');
    setStartAt('');
    setDurationMinutes(60);
    setProjectDetails('');
    setNotes('');
    setBudgetRange('');
    setTimeline('');
    setReferralSource('');
  };

  const computeEndAtIso = (startLocal: string, duration: number) => {
    // Convert input type="datetime-local" string to Date in local tz, then to ISO
    // Format is YYYY-MM-DDTHH:mm
    const date = new Date(startLocal);
    if (Number.isNaN(date.getTime())) return '';
    const end = new Date(date.getTime() + duration * 60 * 1000);
    return end.toISOString();
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Basic validation
    if (!firstName.trim() || !lastName.trim()) {
      onError('Please provide your first and last name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      onError('Please provide a valid email address.');
      return;
    }
    if (!startAt) {
      onError('Please select a preferred date and time.');
      return;
    }

    setSubmitting(true);
    try {
      // Prepare payload (not submitted yet; backend integration to be added later)
      const startIso = new Date(startAt).toISOString();
      const endIso = computeEndAtIso(startAt, durationMinutes);
      const payload = {
        client_email: email,
        client_first_name: firstName,
        client_last_name: lastName,
        client_phone: phone || undefined,
        client_company: company || undefined,
        project_details: projectDetails || undefined,
        budget_range: budgetRange || undefined,
        timeline: timeline || undefined,
        referral_source: referralSource || undefined,
        package_id: selectedPackageId || undefined,
        start_at: startIso,
        end_at: endIso,
        duration_minutes: durationMinutes,
        notes: notes || undefined,
      };

      // Call real API to create consultation
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.message || 'Failed to create consultation');
      }
      const result = await res.json();
      onSuccess({ id: result?.consultation?.id || 'unknown', status: result?.consultation?.status });
      resetForm();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to book consultation';
      onError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Consultation" size="xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Info */}
        <div className="card-3d-spline rounded-xl p-5 md:p-6">
          <h3 className="text-3d-spline-text-primary text-lg font-semibold mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.currentTarget.value)} placeholder="Jane" required />
            <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.currentTarget.value)} placeholder="Doe" required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} placeholder="jane@example.com" required />
            <Input label="Phone (optional)" value={phone} onChange={(e) => setPhone(e.currentTarget.value)} placeholder="(555) 123-4567" />
            <Input label="Company (optional)" value={company} onChange={(e) => setCompany(e.currentTarget.value)} placeholder="Your Studio, LLC" className="md:col-span-2" />
          </div>
        </div>

        {/* Package & Scheduling */}
        <div className="card-3d-spline rounded-xl p-5 md:p-6">
          <h3 className="text-3d-spline-text-primary text-lg font-semibold mb-4">Package & Scheduling</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Select label="Package" value={selectedPackageId} onChange={(e) => setSelectedPackageId(e.currentTarget.value)} disabled={isLoadingPackages}>
                <option value="">Select a package (optional)</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} • {p.duration_minutes}m {p.price_cents === 0 ? 'Free' : `$${(p.price_cents / 100).toFixed(2)}`}
                  </option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-1">
              <Input label="Preferred Date & Time" type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.currentTarget.value)} required />
            </div>
            <div className="md:col-span-1">
              <Select label="Duration" value={String(durationMinutes)} onChange={(e) => setDurationMinutes(Number(e.currentTarget.value))}>
                {durationOptions.map((m) => (
                  <option key={m} value={m}>{m} minutes</option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="card-3d-spline rounded-xl p-5 md:p-6">
          <h3 className="text-3d-spline-text-primary text-lg font-semibold mb-4">Project Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select label="Budget (optional)" value={budgetRange} onChange={(e) => setBudgetRange(e.currentTarget.value)}>
              <option value="">Select budget range</option>
              <option value="$0-250">$0 - $250</option>
              <option value="$250-500">$250 - $500</option>
              <option value="$500-1000">$500 - $1,000</option>
              <option value="$1000+">$1,000+</option>
            </Select>
            <Select label="Timeline (optional)" value={timeline} onChange={(e) => setTimeline(e.currentTarget.value)}>
              <option value="">Select timeline</option>
              <option value="asap">ASAP</option>
              <option value="1-2 weeks">1 - 2 weeks</option>
              <option value="2-4 weeks">2 - 4 weeks</option>
              <option value=">1 month">More than 1 month</option>
            </Select>
            <Select label="How did you hear about us? (optional)" value={referralSource} onChange={(e) => setReferralSource(e.currentTarget.value)} className="md:col-span-2">
              <option value="">Select a source</option>
              <option value="friend">Friend/Referral</option>
              <option value="social">Social Media</option>
              <option value="search">Search Engine</option>
              <option value="ad">Ad/Promotion</option>
              <option value="other">Other</option>
            </Select>
            <Textarea label="Project Details (optional)" value={projectDetails} onChange={(e) => setProjectDetails(e.currentTarget.value)} placeholder="Tell us about your project, goals, references, and any specifics." className="md:col-span-2" rows={5} />
            <Textarea label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.currentTarget.value)} placeholder="Anything else we should know?" className="md:col-span-2" rows={4} />
      </div>
    </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Booking…' : 'Book Consultation'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ConsultationBookingForm;
