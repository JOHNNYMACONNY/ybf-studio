import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import AdminLayout from '../../components/AdminLayout';
import BeatCard from '../../components/BeatCard';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import type { Beat } from '../../types/beat';
import SimpleFileUpload from '../../components/admin/SimpleFileUpload';
import { validateSoundCloudUrl, validateGoogleDriveUrl } from '../../utils/fileValidation';

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
        coverArt: beat.cover_art,
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
    } catch (error) {
      console.error('Error adding beat:', error);
      alert(`Error adding beat: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        coverArt: beat.cover_art,
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
    } catch (error) {
      console.error('Error updating beat:', error);
      alert(`Error updating beat: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    } catch (error) {
      console.error('Error deleting beat:', error);
      alert(`Error deleting beat: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Beat
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBeats.map((beat) => (
            <div key={beat.id} className="relative group">
              <BeatCard beat={beat} />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditingBeat(beat)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDeleteBeat(beat.id)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Beat Modal */}
        {(isAddModalOpen || editingBeat) && (
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

const BeatFormModal: React.FC<BeatFormModalProps> = ({ beat, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    title: beat?.title || '',
    artist: beat?.artist || '',
    genre: beat?.genre || 'Hip-Hop',
    bpm: beat?.bpm || 140,
    price: beat?.price || 29.99,
    description: beat?.description || '',
    previewUrl: beat?.previewUrl || '',
    fullTrackUrl: beat?.fullTrackUrl || '',
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.artist.trim()) newErrors.artist = 'Artist is required';
    if (formData.bpm < 60 || formData.bpm > 200) newErrors.bpm = 'BPM must be between 60-200';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';

    // Validate URLs if provided
    if (formData.previewUrl && !validateSoundCloudUrl(formData.previewUrl).isValid) {
      newErrors.previewUrl = 'Please enter a valid SoundCloud URL';
    }
    if (formData.fullTrackUrl && !validateGoogleDriveUrl(formData.fullTrackUrl).isValid) {
      newErrors.fullTrackUrl = 'Please enter a valid Google Drive URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const beatId = beat?.id || Date.now().toString();
    onSave(beatId, formData);
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-neutral-900 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-neutral-100 mb-6">
          {beat ? 'Edit Beat' : 'Add New Beat'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <h4 className="text-sm font-medium text-neutral-200 mb-2">📝 Upload Instructions:</h4>
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
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={errors.title ? 'border-red-500' : ''}
                  required
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Artist *
                </label>
                <Input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className={errors.artist ? 'border-red-500' : ''}
                  required
                />
                {errors.artist && <p className="text-red-400 text-xs mt-1">{errors.artist}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Genre
                </label>
                <Select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
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
                  value={formData.bpm}
                  onChange={(e) => setFormData({ ...formData, bpm: parseInt(e.target.value) })}
                  min="60"
                  max="200"
                  className={errors.bpm ? 'border-red-500' : ''}
                  required
                />
                {errors.bpm && <p className="text-red-400 text-xs mt-1">{errors.bpm}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Price ($) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  min="0"
                  className={errors.price ? 'border-red-500' : ''}
                  required
                />
                {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
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
                  value={formData.previewUrl}
                  onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
                  placeholder="https://soundcloud.com/..."
                  className={errors.previewUrl ? 'border-red-500' : ''}
                />
                {errors.previewUrl && <p className="text-red-400 text-xs mt-1">{errors.previewUrl}</p>}
                <p className="text-xs text-neutral-400 mt-1">30-60 second preview snippet</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Google Drive Full Track URL
                </label>
                <Input
                  type="url"
                  value={formData.fullTrackUrl}
                  onChange={(e) => setFormData({ ...formData, fullTrackUrl: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className={errors.fullTrackUrl ? 'border-red-500' : ''}
                />
                {errors.fullTrackUrl && <p className="text-red-400 text-xs mt-1">{errors.fullTrackUrl}</p>}
                <p className="text-xs text-neutral-400 mt-1">Full track for customer downloads</p>
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
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/beats`);
    const initialBeats = res.ok ? await res.json() : [];
    
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