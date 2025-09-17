import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import AdminLayout from '../../components/AdminLayout';
import BeatAdminCard from '../../components/admin/BeatAdminCard';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { Plus, Search, Filter } from 'lucide-react';
import type { Beat } from '../../types/beat';
import { useUnifiedAudio } from '../../components/audio/UnifiedAudioContext';
import SimpleFileUpload from '../../components/admin/SimpleFileUpload';
import { validateSoundCloudUrl, validateGoogleDriveUrl } from '../../utils/fileValidation';
import { useToast } from '../../components/ui/ToastContext';
import { useForm } from 'react-hook-form';

// Available beat cover art images
const BEAT_COVER_IMAGES = [
  '/assets/beatCovers/beat_cover_1.png',
  '/assets/beatCovers/beat_cover_2.png',
  '/assets/beatCovers/beat_cover_3.png',
  '/assets/beatCovers/beat_cover_4.png'
];

// Get random cover art image
const getRandomCoverArt = () => {
  const randomIndex = Math.floor(Math.random() * BEAT_COVER_IMAGES.length);
  return BEAT_COVER_IMAGES[randomIndex];
};
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type UserWithAdmin = {
  isAdmin?: boolean;
  [key: string]: unknown;
};

interface AdminBeatsPageProps {
  initialBeats: Beat[];
}

const genres = ['All', 'Trap', 'R&B', 'Hip-Hop', 'Lo-fi', 'Drill', 'Synthwave'];

const AdminBeatsPage: React.FC<AdminBeatsPageProps> = ({ initialBeats }) => {
  const { data: session, status } = useSession();
  const user = session?.user as UserWithAdmin | undefined;
  const [beats, setBeats] = useState<Beat[]>(initialBeats);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBeat, setEditingBeat] = useState<Beat | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const { } = useUnifiedAudio();
  const { addToast } = useToast();

  // Filter beats based on search and genre
  const filteredBeats = beats.filter(beat => {
    const matchesSearch = beat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         beat.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = genreFilter === 'All' || beat.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const handleAddBeat = async (beatData: Partial<Beat>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/beats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(beatData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add beat');
      }

      const { beat } = await response.json();
      
      // Transform the API response to match our Beat interface
      const newBeat: Beat = {
        id: beat.id,
        title: beat.title,
        artist: beat.artist,
        genre: beat.genre,
        bpm: beat.bpm,
        price: beat.price,
        coverArt: beat.cover_art || getRandomCoverArt(),
        audioUrl: beat.audio_url || '',
        previewUrl: beat.preview_url || '',
        fullTrackUrl: beat.full_track_url || '',
        duration: beat.duration,
        previewDuration: beat.preview_duration,
        description: beat.description,
        licenseTypes: beat.license_types
      };
      
      setBeats([...beats, newBeat]);
      setIsAddModalOpen(false);
      addToast({ type: 'success', message: 'Beat added successfully!' });
    } catch (error) {
      console.error('Error adding beat:', error);
      addToast({ type: 'error', message: `Error adding beat: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  const handleEditBeat = async (beatId: string, beatData: Partial<Beat>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/beats?id=${beatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(beatData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update beat');
      }

      const { beat } = await response.json();
      
      // Transform the API response to match our Beat interface
      const updatedBeat: Beat = {
        id: beat.id,
        title: beat.title,
        artist: beat.artist,
        genre: beat.genre,
        bpm: beat.bpm,
        price: beat.price,
        coverArt: beat.cover_art || getRandomCoverArt(),
        audioUrl: beat.audio_url || '',
        previewUrl: beat.preview_url || '',
        fullTrackUrl: beat.full_track_url || '',
        duration: beat.duration,
        previewDuration: beat.preview_duration,
        description: beat.description,
        licenseTypes: beat.license_types
      };

      setBeats(beats.map(b => b.id === beatId ? updatedBeat : b));
      setEditingBeat(null);
      addToast({ type: 'success', message: 'Beat updated successfully!' });
    } catch (error) {
      console.error('Error updating beat:', error);
      addToast({ type: 'error', message: `Error updating beat: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBeat = async (beatId: string) => {
    if (!confirm('Are you sure you want to delete this beat?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/beats?id=${beatId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete beat');
      }

      setBeats(beats.filter(beat => beat.id !== beatId));
      addToast({ type: 'success', message: 'Beat deleted.' });
    } catch (error) {
      console.error('Error deleting beat:', error);
      addToast({ type: 'error', message: `Error deleting beat: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (!session || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-100 mb-4">Admin Access Required</h1>
          <p className="text-neutral-400">Please sign in with an admin account.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-100">Beat Management</h1>
            <p className="text-neutral-400 mt-2">Manage your beat catalog</p>
          </div>
          <Button 
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Beat
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search beats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          </div>
          <Select 
            value={genreFilter} 
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </Select>
          <div className="text-neutral-400 text-sm flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {filteredBeats.length} of {beats.length} beats
          </div>
        </div>

        {/* Beats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBeats.map((beat) => (
            <BeatAdminCard
              key={beat.id}
              beat={beat}
              onEdit={(b) => setEditingBeat(b)}
              onDelete={handleDeleteBeat}
            />
          ))}
        </div>

        {/* Add/Edit Beat Modal */}
        {(isAddModalOpen === true || !!editingBeat) && (
          <BeatFormModal
            beat={editingBeat}
            onSave={editingBeat ? 
              (beatId: string, data: Partial<Beat>) => handleEditBeat(beatId, data) : 
              (beatId: string, data: Partial<Beat>) => handleAddBeat(data)
            }
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingBeat(null);
            }}
            loading={loading}
          />
        )}
      </div>
    </AdminLayout>
  );
};

// Beat Form Modal Component
interface BeatFormModalProps {
  beat?: Beat | null;
  onSave: (beatId: string, data: Partial<Beat>) => void;
  onClose: () => void;
  loading: boolean;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  genre: z.string().min(1),
  bpm: z.coerce.number().int().min(60, 'Min 60').max(200, 'Max 200'),
  description: z.string().optional().default(''),
  previewUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  fullTrackUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  coverArt: z.string().url('Invalid URL').optional().or(z.literal('')),
  status: z.enum(['draft', 'published']).default('published'),
  mp3Price: z.coerce.number().min(0, 'Must be >= 0').default(19),
  wavPrice: z.coerce.number().min(0, 'Must be >= 0').default(29),
  premiumPrice: z.coerce.number().min(0, 'Must be >= 0').default(49),
  exclusivePrice: z.coerce.number().min(0, 'Must be >= 0').default(199),
});

type FormValues = z.infer<typeof formSchema>;

const BeatFormModal: React.FC<BeatFormModalProps> = ({ beat, onSave, onClose, loading }) => {
  const [, setAudioFile] = useState<File | null>(null);
  const [, setCoverFile] = useState<File | null>(null);

  const defaultValues: FormValues = {
    title: beat?.title || '',
    artist: beat?.artist || '',
    genre: beat?.genre || 'Hip-Hop',
    bpm: beat?.bpm || 140,
    description: beat?.description || '',
    previewUrl: beat?.previewUrl || '',
    fullTrackUrl: beat?.fullTrackUrl || '',
    coverArt: beat?.coverArt || '',
    status: (beat as { status?: 'draft' | 'published' } | null | undefined)?.status || 'published',
    mp3Price: beat?.licenseTypes?.mp3 ?? beat?.price ?? 19,
    wavPrice: beat?.licenseTypes?.wav ?? beat?.price ?? 29,
    premiumPrice: beat?.licenseTypes?.premium ?? beat?.price ?? 49,
    exclusivePrice: beat?.licenseTypes?.exclusive ?? 199,
  };

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const onSubmit = (values: FormValues) => {
    // Additional URL validation aligned with utils
    if (values.previewUrl && !validateSoundCloudUrl(values.previewUrl).isValid) {
      return;
    }
    if (values.fullTrackUrl && !validateGoogleDriveUrl(values.fullTrackUrl).isValid) {
      return;
    }

    const beatId = beat?.id || Date.now().toString();
    const payload: Partial<Beat> & {
      status?: 'draft' | 'published';
      licenseTypes?: Beat['licenseTypes'];
    } = {
      title: values.title,
      artist: values.artist,
      genre: values.genre,
      bpm: values.bpm,
      description: values.description || '',
      previewUrl: values.previewUrl || '',
      fullTrackUrl: values.fullTrackUrl || '',
      coverArt: values.coverArt || '',
      // Per-license pricing replaces single price
      licenseTypes: {
        mp3: values.mp3Price,
        wav: values.wavPrice,
        premium: values.premiumPrice,
        exclusive: values.exclusivePrice,
      },
      // Surfaced for API (mapped to DB status)
      status: values.status,
    } as Partial<Beat> & { status?: 'draft' | 'published'; licenseTypes?: Beat['licenseTypes'] };

    onSave(beatId, payload);
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-neutral-900 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-neutral-100 mb-6">
          {beat ? 'Edit Beat' : 'Add New Beat'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload Section */}
          <div className="bg-neutral-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-neutral-200 mb-4">File Upload</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimpleFileUpload
                onFileSelect={setAudioFile}
                accept="audio/*"
                label="Audio File (MP3/WAV)"
                maxSize={50}
              />
              <SimpleFileUpload
                onFileSelect={setCoverFile}
                accept="image/*"
                label="Cover Art (JPG/PNG)"
                maxSize={10}
              />
            </div>
            <div className="mt-4 p-3 bg-neutral-700 rounded-lg">
              <h4 className="text-sm font-medium text-neutral-200 mb-2">Upload Instructions:</h4>
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• Upload audio file to SoundCloud for preview (30-60 seconds)</li>
                <li>• Upload full track to Google Drive for customer downloads</li>
                <li>• Enter the URLs in the fields below after uploading</li>
                <li>• Cover art will be used for beat display</li>
              </ul>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-neutral-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-neutral-200 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Title *
                </label>
                <Input
                  type="text"
                  {...register('title')}
                  className={errors.title ? 'border-red-500' : ''}
                  required
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message as string}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Artist *
                </label>
                <Input
                  type="text"
                  {...register('artist')}
                  className={errors.artist ? 'border-red-500' : ''}
                  required
                />
                {errors.artist && <p className="text-red-400 text-xs mt-1">{errors.artist.message as string}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Genre
                </label>
                <Select
                  {...register('genre')}
                  defaultValue={defaultValues.genre}
                >
                  {genres.slice(1).map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  BPM *
                </label>
                <Input
                  type="number"
                  {...register('bpm', { valueAsNumber: true })}
                  min="60"
                  max="200"
                  className={errors.bpm ? 'border-red-500' : ''}
                  required
                />
                {errors.bpm && <p className="text-red-400 text-xs mt-1">{errors.bpm.message as string}</p>}
              </div>

              {/* Per-license pricing */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Pricing (per license)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">MP3 ($)</label>
                    <Input type="number" step="0.01" min="0" {...register('mp3Price', { valueAsNumber: true })} className={errors.mp3Price ? 'border-red-500' : ''} />
                    {errors.mp3Price && <p className="text-red-400 text-xs mt-1">{errors.mp3Price.message as string}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">WAV ($)</label>
                    <Input type="number" step="0.01" min="0" {...register('wavPrice', { valueAsNumber: true })} className={errors.wavPrice ? 'border-red-500' : ''} />
                    {errors.wavPrice && <p className="text-red-400 text-xs mt-1">{errors.wavPrice.message as string}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Premium ($)</label>
                    <Input type="number" step="0.01" min="0" {...register('premiumPrice', { valueAsNumber: true })} className={errors.premiumPrice ? 'border-red-500' : ''} />
                    {errors.premiumPrice && <p className="text-red-400 text-xs mt-1">{errors.premiumPrice.message as string}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Exclusive ($)</label>
                    <Input type="number" step="0.01" min="0" {...register('exclusivePrice', { valueAsNumber: true })} className={errors.exclusivePrice ? 'border-red-500' : ''} />
                    {errors.exclusivePrice && <p className="text-red-400 text-xs mt-1">{errors.exclusivePrice.message as string}</p>}
                  </div>
                </div>
              </div>

              {/* Status toggle */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Status</label>
                <Select {...register('status')} defaultValue={defaultValues.status}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </div>
            </div>
          </div>

          {/* URLs Section */}
          <div className="bg-neutral-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-neutral-200 mb-4">Audio URLs</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  SoundCloud Preview URL
                </label>
                <Input
                  type="url"
                  placeholder="https://soundcloud.com/..."
                  {...register('previewUrl')}
                  className={errors.previewUrl ? 'border-red-500' : ''}
                />
                {errors.previewUrl && <p className="text-red-400 text-xs mt-1">{errors.previewUrl.message as string}</p>}
                <p className="text-xs text-neutral-400 mt-1">30-60 second preview snippet</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Google Drive Full Track URL
                </label>
                <Input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  {...register('fullTrackUrl')}
                  className={errors.fullTrackUrl ? 'border-red-500' : ''}
                />
                {errors.fullTrackUrl && <p className="text-red-400 text-xs mt-1">{errors.fullTrackUrl.message as string}</p>}
                <p className="text-xs text-neutral-400 mt-1">Full track for customer downloads</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Cover Art URL (optional)
                </label>
                <Input
                  type="url"
                  placeholder="https://your-cdn.com/path/to/cover.jpg"
                  {...register('coverArt')}
                  className={errors.coverArt ? 'border-red-500' : ''}
                />
                {errors.coverArt && <p className="text-red-400 text-xs mt-1">{errors.coverArt.message as string}</p>}
                <p className="text-xs text-neutral-400 mt-1">If left blank, a random fallback cover will be used.</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-neutral-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-neutral-200 mb-4">Description</h3>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Description
              </label>
              <Textarea
                {...register('description')}
                defaultValue={defaultValues.description}
                rows={4}
                placeholder="Describe the beat, mood, style, etc..."
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : (beat ? 'Update Beat' : 'Add Beat')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const user = session?.user as UserWithAdmin | undefined;

  if (!session || !user?.isAdmin) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  try {
    // Build base URL from incoming headers for robustness across envs
    const forwardedProto = (context.req.headers['x-forwarded-proto'] as string) || undefined;
    const forwardedHost = (context.req.headers['x-forwarded-host'] as string) || undefined;
    const host = (forwardedHost || context.req.headers.host)!;
    const protocol = forwardedProto || (host?.includes('localhost') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;

    // Primary: fetch via API
    let initialBeats: Beat[] = [] as unknown as Beat[];
    try {
      const res = await fetch(`${baseUrl}/api/beats`);
      initialBeats = res.ok ? await res.json() : [];
    } catch (err) {
      console.error('Error fetching beats from API:', err);
      initialBeats = [];
    }

    return {
      props: {
        initialBeats,
      },
    };
  } catch (error) {
    console.error('Error fetching beats:', error);
    return {
      props: {
        initialBeats: [],
      },
    };
  }
};

export default AdminBeatsPage; 