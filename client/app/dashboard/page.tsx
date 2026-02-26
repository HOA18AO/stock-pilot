'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function DashboardPage() {
  const router = useRouter();
  const [prices, setPrices] = useState<number[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
    
    // Generate random prices on client side only
    setPrices(Array.from({ length: 5 }, () => Math.random() * 500 + 100));
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Sales" value="$45,231" change="+12.5%" positive />
          <StatCard title="Orders" value="1,234" change="+8.2%" positive />
          <StatCard title="Products" value="567" change="-2.4%" positive={false} />
          <StatCard title="Customers" value="8,945" change="+15.3%" positive />
        </div>

        {/* Sample Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ContentCard title="Recent Orders">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Order #{1000 + i}</p>
                    <p className="text-gray-400 text-sm">Customer {i}</p>
                  </div>
                  <span className="text-green-400 font-semibold">${prices[i - 1]?.toFixed(2) || '0.00'}</span>
                </div>
              ))}
            </div>
          </ContentCard>

          <ContentCard title="Quick Actions">
            <div className="space-y-3">
              <Button variant="primary" fullWidth onClick={() => router.push('/products')}>
                Manage Products
              </Button>
              <Button variant="secondary" fullWidth onClick={() => router.push('/orders')}>
                Manage Orders
              </Button>
              <Button variant="outline" fullWidth onClick={() => router.push('/items')}>
                View Inventory
              </Button>
              <Button variant="ghost" fullWidth onClick={() => router.push('/warehouse')}>
                View Warehouses
              </Button>
            </div>
          </ContentCard>
        </div>

        {/* Long content to test scroll */}
        <div className="space-y-6">
          <ContentCard title="Activity Feed">
            <div className="space-y-4">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="flex items-start space-x-3 pb-4 border-b border-gray-700 last:border-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white">Activity item {i + 1}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      This is a sample activity description to demonstrate the scroll-to-top functionality.
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{i} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, positive }: { title: string; value: string; change: string; positive: boolean }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      <p className={`text-sm font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {change} from last month
      </p>
    </div>
  );
}

function ContentCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}
