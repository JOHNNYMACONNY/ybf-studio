import React from 'react';
import Image from 'next/image';
import { Edit, Trash2, Clock, AlertTriangle } from 'lucide-react';
import type { Beat } from '../../types/beat';
import Button from '../ui/Button';

interface BeatAdminCardProps {
  beat: Beat;
  onEdit: (beat: Beat) => void;
  onDelete: (beatId: string) => void;
}

const BeatAdminCard: React.FC<BeatAdminCardProps> = ({ beat, onEdit, onDelete }) => {
  // Check if beat has valid preview source
  const hasValidPreview = !!(
    (beat.previewUrl && beat.previewUrl.trim() && !beat.previewUrl.includes('undefined') && !beat.previewUrl.includes('null')) ||
    (beat.audioUrl && beat.audioUrl.trim() && !beat.audioUrl.includes('undefined') && !beat.audioUrl.includes('null'))
  );

  return (
    <div className={`card-3d-spline rounded-xl overflow-hidden flex flex-col ${!hasValidPreview ? 'ring-2 ring-amber-500/50' : ''}`}>
      <div className="relative">
        <Image
          src={beat.coverArt}
          alt={beat.title}
          width={400}
          height={300}
          className="w-full aspect-video object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {beat.previewDuration || beat.duration}
        </div>
        {!hasValidPreview && (
          <div className="absolute top-2 left-2 bg-amber-500/90 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            No Preview
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="min-h-[42px]">
          <div className="text-sm font-semibold text-3d-spline-text-primary line-clamp-2">{beat.title}</div>
          <div className="text-xs text-3d-spline-text-muted">{beat.artist}</div>
        </div>

        <div className="text-xs text-3d-spline-text-muted">
          {beat.genre} • {beat.bpm} BPM • {beat.duration}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 text-xs">
          <div className="bg-neutral-800/70 rounded px-2 py-1 text-center">
            MP3 ${beat.licenseTypes?.mp3 ?? beat.price}
          </div>
          <div className="bg-neutral-800/70 rounded px-2 py-1 text-center">
            WAV ${beat.licenseTypes?.wav ?? beat.price}
          </div>
          <div className="bg-neutral-800/70 rounded px-2 py-1 text-center">
            Premium ${beat.licenseTypes?.premium ?? beat.price}
          </div>
          <div className="bg-neutral-800/70 rounded px-2 py-1 text-center">
            Exclusive ${beat.licenseTypes?.exclusive ?? 199}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-neutral-800 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="flex-1"
          onClick={() => onEdit(beat)}
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="text-red-400 hover:text-red-300"
          onClick={() => onDelete(beat.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </div>
    </div>
  );
};

export default BeatAdminCard;


