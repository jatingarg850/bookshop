'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface Address {
  _id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAddresses();
    }
  }, [status]);

  async function fetchAddresses() {
    try {
      const res = await fetch('/api/user/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingId) {
        // Update address
        const res = await fetch(`/api/user/addresses/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          fetchAddresses();
          setEditingId(null);
          setFormData({
            name: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            isDefault: false,
          });
          setShowAddForm(false);
        }
      } else {
        // Create new address
        const res = await fetch('/api/user/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          fetchAddresses();
          setFormData({
            name: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            isDefault: false,
          });
          setShowAddForm(false);
        }
      }
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchAddresses();
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  }

  function handleEdit(address: Address) {
    setEditingId(address._id);
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault || false,
    });
    setShowAddForm(true);
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container-max py-12">
        <Card className="text-center max-w-md mx-auto">
          <h1 className="font-heading text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your profile.</p>
          <Button onClick={() => signIn()} size="lg">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-max py-12">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold mb-2">{session?.user?.name}</h1>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Addresses Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-heading text-2xl font-bold">My Addresses</h2>
            {!showAddForm && (
              <Button onClick={() => setShowAddForm(true)}>
                + Add Address
              </Button>
            )}
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <Card className="mb-8">
              <h3 className="font-heading text-xl font-bold mb-4">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Phone Number"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <Input
                  label="Address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <Input
                    label="State"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                  <Input
                    label="Pincode"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>

                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">Set as default address</span>
                </label>

                <div className="flex gap-4">
                  <Button type="submit">
                    {editingId ? 'Update Address' : 'Add Address'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingId(null);
                      setFormData({
                        name: '',
                        phone: '',
                        address: '',
                        city: '',
                        state: '',
                        pincode: '',
                        isDefault: false,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Addresses List */}
          {loading ? (
            <p className="text-center text-gray-600">Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <Card className="text-center">
              <p className="text-gray-600 mb-4">No addresses saved yet</p>
              <Button onClick={() => setShowAddForm(true)}>Add Your First Address</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <Card
                  key={address._id}
                  className={`relative ${address.isDefault ? 'border-2 border-primary-600' : ''}`}
                >
                  {address.isDefault && (
                    <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Default
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="font-semibold text-lg">{address.name}</h3>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                  </div>

                  <div className="text-sm text-gray-700 mb-4 space-y-1">
                    <p>{address.address}</p>
                    <p>
                      {address.city}, {address.state} {address.pincode}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address._id)}
                      className="text-red-600 border-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
