'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  async function fetchMessages(page = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
      });
      if (statusFilter) params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/admin/contact?${params}`);
      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();
      setMessages(data.messages);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages(1);
  }, [statusFilter, searchQuery]);

  async function handleStatusChange(messageId: string, newStatus: string) {
    try {
      const response = await fetch(`/api/admin/contact/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const updated = await response.json();
      setMessages(messages.map((m) => (m._id === messageId ? updated : m)));
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(updated);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  async function handleDelete(messageId: string) {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/admin/contact/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete message');

      setMessages(messages.filter((m) => m._id !== messageId));
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(null);
        setShowDetail(false);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }

  async function handleViewMessage(message: ContactMessage) {
    setSelectedMessage(message);
    setShowDetail(true);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-gray-600 mt-2">Manage customer contact form submissions</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Search</label>
            <Input
              placeholder="Search by name, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Messages</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold">{pagination.total}</span> messages
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No messages found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?._id === message._id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{message.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(message.status)}`}>
                            {getStatusLabel(message.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{message.email}</p>
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">{message.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={fetchMessages}
              />
            </div>
          </Card>
        </div>

        {/* Message Detail */}
        <div>
          {showDetail && selectedMessage ? (
            <Card className="p-6 sticky top-8">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Message Details</h2>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                  <p className="text-gray-900 font-semibold">{selectedMessage.name}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                  <p className="text-gray-900 font-semibold break-all">{selectedMessage.email}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusChange(selectedMessage._id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
                  <p className="text-gray-900 text-sm">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Message</label>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                    <p className="text-gray-900 text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="block w-full px-4 py-2 bg-primary-600 text-white rounded-lg text-center font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Reply via Email
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleDelete(selectedMessage._id)}
                  >
                    Delete Message
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center text-gray-600">
              <p>Select a message to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
