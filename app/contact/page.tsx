'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Get in</span>
              <span className="block text-primary-600">Touch</span>
            </h1>
            <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 pointer-events-none z-0">
          <img src="/left-border.png" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none z-0">
          <img src="/right-border.png" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <h2 className="font-heading text-2xl font-bold mb-6 text-gray-900">Send us a Message</h2>

                {submitted && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                    ✓ Thank you for your message! We'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={6}
                      placeholder="Your message here..."
                    />
                  </div>

                  <Button type="submit" size="lg" isLoading={loading} className="w-full">
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <Card className="shadow-lg">
                <h2 className="font-heading text-xl font-bold mb-6 text-gray-900">Contact Information</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-semibold">📧 Email</p>
                    <p className="font-semibold text-gray-900">sre.haryana24@gmail.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-semibold">📞 Phone</p>
                    <p className="font-semibold text-gray-900">+91 98217 38866</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-semibold">📍 Address</p>
                    <p className="font-semibold text-gray-900">
                      J - 90 , DLF , Sector 10<br />
                      Faridabad<br />
                      Haryana - 121006
                    </p>
                  </div>
                  <div>
                   
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
