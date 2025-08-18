import React, { useState } from 'react';
import Input from '../Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { Send } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'General Inquiry',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', inquiryType: 'General Inquiry', message: '' });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center p-8 bg-emerald-900/20 ring-1 ring-emerald-500/30 rounded-xl">
        <h3 className="font-semibold text-card-title text-emerald-300">Thank you!</h3>
        <p className="text-neutral-300 mt-2">Your message has been sent. We&apos;ll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">Full Name</label>
          <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">Email Address</label>
          <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <label htmlFor="inquiryType" className="block text-sm font-medium text-neutral-300 mb-2">What can we help with?</label>
        <Select name="inquiryType" id="inquiryType" value={formData.inquiryType} onChange={handleChange}>
          <option>General Inquiry</option>
          <option>Beat Licensing</option>
          <option>Mixing Services</option>
          <option>Mastering Services</option>
          <option>Custom Work</option>
        </Select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">Message</label>
        <Textarea name="message" id="message" rows={5} value={formData.message} onChange={handleChange} required />
      </div>
      <div>
        <Button type="submit" disabled={status === 'loading'} className="w-full md:w-auto">
          {status === 'loading' ? 'Sending...' : 'Send Message'}
          <Send className="h-4 w-4" />
        </Button>
        {status === 'error' && <p className="text-red-500 mt-4">Something went wrong. Please try again.</p>}
      </div>
      <p className="text-xs text-neutral-500">We respect your privacy. Your information is never shared.</p>
    </form>
  );
};

export default ContactForm;