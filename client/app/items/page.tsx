'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table, { TableColumn } from '@/components/Table/Table';
import Button from '@/components/Button';

interface Item {
  id: number;
  itemCode: string;
  categoryCode: string;
  name: string;
  code: string | null;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3008';
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchItems(token);
  }, [router]);

  const fetchItems = async (token: string) => {
    try {
      const res = await fetch(`${getApiUrl()}/item`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch items');
      }

      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn<Item>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (value) => <span className="font-mono text-gray-400">#{value}</span>,
    },
    {
      key: 'itemCode',
      label: 'Item Code',
      sortable: true,
      render: (value) => <span className="font-mono font-semibold text-blue-400">{value}</span>,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value) => <span className="font-medium text-white">{value}</span>,
    },
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      render: (value) => (
        value ? (
          <span className="font-mono text-gray-400">{value}</span>
        ) : (
          <span className="text-gray-500">-</span>
        )
      ),
    },
    {
      key: 'categoryCode',
      label: 'Category',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-medium">
          {value}
        </span>
      ),
    },
    {
      key: 'available',
      label: 'Availability',
      sortable: true,
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value
              ? 'bg-green-900 text-green-300'
              : 'bg-red-900 text-red-300'
          }`}
        >
          {value ? 'Available' : 'Unavailable'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => (
        <span className="text-gray-400 text-xs">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-white text-lg">Loading items...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Items</h1>
            <p className="text-gray-400">
              Manage your items ({items.length} total)
            </p>
          </div>
          <Button variant="primary">
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <Table
            data={items}
            columns={columns}
            searchableColumns={['itemCode', 'name', 'code', 'categoryCode']}
            defaultRowsPerPage={10}
          />
        </div>
      </div>
    </div>
  );
}
