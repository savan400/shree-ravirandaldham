'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchEvents, deleteEvent, EventEntry, getImageUrl } from '@/services/events-service';
import { AdminButton, Card } from './components/AdminUI';
import { Plus, Edit2, Trash2, Calendar, MapPin } from 'lucide-react';
import EventForm from './EventForm';
import Pagination from '@/components/Pagination/Pagination';

const PER_PAGE = 8;

export default function EventsCMS() {
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventEntry | undefined>();

  const loadEvents = useCallback(async (p: number) => {
    setLoading(true);
    const result = await fetchEvents(p, PER_PAGE);
    setEvents(result.data);
    setTotal(result.total);
    setLoading(false);
  }, []);

  useEffect(() => { loadEvents(page); }, [page, loadEvents]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        loadEvents(page);
      } catch {
        alert('Failed to delete event');
      }
    }
  };

  if (isFormOpen) {
    return (
      <EventForm
        event={editingEvent}
        onClose={() => setIsFormOpen(false)}
        onSave={() => { setIsFormOpen(false); loadEvents(page); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Events Management</h2>
          <p className="text-sm md:text-base text-gray-500">
            Add and manage upcoming events.
            {total > 0 && <span className="ml-2 font-semibold text-orange-500">{total} total</span>}
          </p>
        </div>
        <AdminButton
          onClick={() => { setEditingEvent(undefined); setIsFormOpen(true); }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Event
        </AdminButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : total === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          No events found. Click "Add New Event" to create one.
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event._id} className="overflow-hidden flex flex-col sm:flex-row h-full">
                <div className="w-full sm:w-40 h-48 sm:h-auto relative bg-orange-50 flex-shrink-0">
                  {event.coverImage || (event.images && event.images.length > 0) ? (
                    <img
                      src={getImageUrl(event.coverImage || event.images[0])}
                      alt={event.title.en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-200">
                      <Calendar className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{event.title.en}</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" /><span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" /><span>{event.location.en}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingEvent(event); setIsFormOpen(true); }}
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-orange-50 text-xs text-gray-400">
                    Last updated: {new Date(event.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Pagination
            page={page}
            total={total}
            perPage={PER_PAGE}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
