'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: { _id: string; name: string; slug: string } | null;
  isActive: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
  });

  const limit = 10;

  useEffect(() => {
    fetchAllCategories();
    fetchCategories();
  }, [search, page, selectedParentId]);

  async function fetchAllCategories() {
    try {
      const res = await fetch('/api/admin/categories?limit=1000');
      if (res.ok) {
        const data = await res.json();
        setAllCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch all categories:', error);
    }
  }

  async function fetchCategories() {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedParentId) params.append('parentId', selectedParentId);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const res = await fetch(`/api/admin/categories?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/categories/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            parentId: selectedParentId || null,
          }),
        });

        if (res.ok) {
          fetchAllCategories();
          fetchCategories();
          setEditingId(null);
          setShowForm(false);
          setFormData({ name: '', slug: '', description: '', icon: '' });
          setSelectedParentId('');
        }
      } else {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            parentId: selectedParentId || null,
          }),
        });

        if (res.ok) {
          fetchAllCategories();
          fetchCategories();
          setShowForm(false);
          setFormData({ name: '', slug: '', description: '', icon: '' });
          setSelectedParentId('');
        }
      }
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchAllCategories();
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  }

  function handleEdit(category: Category) {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
    });
    setSelectedParentId(category.parentId?._id || '');
    setShowForm(true);
  }

  const pages = Math.ceil(total / limit);
  const parentCategories = allCategories.filter(c => !c.parentId);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold">Categories & Subcategories</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ Add Category</Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="mb-8 shadow-lg">
          <h2 className="font-heading text-xl font-bold mb-4">
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Category Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Books, Notebooks"
            />
            <Input
              label="Slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g., books, notebooks"
            />
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Parent Category (Optional - Leave empty for main category)
              </label>
              <select
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">No Parent (Main Category)</option>
                {parentCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Optional description for this category"
              />
            </div>
            <Input
              label="Icon (Emoji or URL)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g., 📚 or https://example.com/icon.png"
            />

            <div className="flex gap-4">
              <Button type="submit">
                {editingId ? 'Update Category' : 'Add Category'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: '', slug: '', description: '', icon: '' });
                  setSelectedParentId('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search */}
      <Card className="mb-6">
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </Card>

      {/* Filter by Parent */}
      <Card className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Filter by Parent Category
        </label>
        <select
          value={selectedParentId}
          onChange={(e) => {
            setSelectedParentId(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Categories</option>
          {parentCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.icon ? `${cat.icon} ` : ''}{cat.name}
            </option>
          ))}
        </select>
      </Card>

      {/* Categories List */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-600">No categories found</p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {categories.map((category) => (
              <Card key={category._id} className="hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {category.icon && <span className="text-2xl">{category.icon}</span>}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          {category.parentId && (
                            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                              Sub of {category.parentId.name}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Slug: {category.slug}</p>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category._id)}
                      className="text-red-600 border-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={pages}
            onPageChange={setPage}
          />
        </>
      )}
    </AdminLayout>
  );
}
