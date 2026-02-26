'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table, { TableColumn } from '@/components/Table/Table';

interface Warehouse {
  id: number;
  code: string;
  name: string;
  description: string | null;
  location: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3008';
}

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchWarehouses(token);
  }, [router]);

  const fetchWarehouses = async (token: string) => {
    try {
      const res = await fetch(`${getApiUrl()}/warehouse`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch warehouses');
      }

      const data = await res.json();
      setWarehouses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn<Warehouse>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (value) => <span className="font-mono text-gray-400">#{value}</span>,
    },
    {
      key: 'code',
      label: 'Code',
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
      key: 'location',
      label: 'Location',
      sortable: true,
      render: (value) => <span className="text-gray-300">{value || '-'}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      render: (value) => (
        <span className="text-gray-400 max-w-xs truncate block">{value || '-'}</span>
      ),
    },
    {
      key: 'active',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      sortable: true,
      render: (value) => (
        <span className="text-gray-400 text-xs">{new Date(value).toLocaleDateString()}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-white text-lg">Loading warehouses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Warehouse</h1>
          <p className="text-gray-400">View and manage warehouse data ({warehouses.length} total)</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <Table
            data={warehouses}
            columns={columns}
            searchableColumns={['code', 'name', 'location', 'description']}
            defaultRowsPerPage={10}
          />
        </div>
      </div>
    </div>
  );
}
