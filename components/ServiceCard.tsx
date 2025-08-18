import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import { getServicePackage } from '../lib/pricing-utils';
import type { ServicePackage } from '../lib/pricing-config';

interface ServiceCardProps {
  serviceId: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ serviceId }) => {
  const service = getServicePackage(serviceId);
  
  if (!service) {
    console.error(`Service package not found: ${serviceId}`);
    return null;
  }

  return (
    <div className="card-interactive flex flex-col">
      <h3 className="text-section text-display">{service.name}</h3>
      <p className="mt-2 text-sm leading-relaxed font-sans flex-grow">
        {service.description}
      </p>
      <div className="mt-4">
        <p className="text-xs text-neutral-500 mb-1">Turnaround: {service.turnaround}</p>
      </div>
      <div className="mt-6 flex justify-between items-end">
        <div>
          <p className="text-neutral-500">Starts at</p>
          <div className="flex items-center gap-2">
            <p className="text-display-small font-bold text-accent">
              ${service.price}
            </p>
            {service.originalPrice && (
              <p className="text-sm text-neutral-500 line-through">
                ${service.originalPrice}
              </p>
            )}
          </div>
        </div>
        <Link href={`/services#${service.id}`} passHref>
          <Button variant="secondary">
            Learn More <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;