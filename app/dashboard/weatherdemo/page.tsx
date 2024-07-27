"use client";

import { useEffect, useState } from 'react';
import WeatherChart from '@/app/ui/dashboard/weather-chart';
import { getTopKWeatherDataByField } from '@/app/lib/data';
import { useSearchParams } from 'next/navigation';

export default async function Page() {
  const searchParams = useSearchParams();
  const field = searchParams.get('field') || 'defaultField';
  const limit = searchParams.get('limit') || '10';
  const order = searchParams.get('order') || 'asc';

  // Convert limit to a number
  const limitNumber = parseInt(limit, 10);

  console.log('field:', field);
  console.log('limit:', limit);
  console.log('order:', order);

  // Fetch data
  const weatherData = await getTopKWeatherDataByField(field, limitNumber, order);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card key="collected" title="Collected" value={totalPaidInvoices} type="collected" /> */}
        {/* <Card key="pending" title="Pending" value={totalPendingInvoices} type="pending" /> */}
        {/* <Card key="invoices" title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
        {/* <Card key="customers" title="Total Customers" value={numberOfCustomers} type="customers" /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart key="revenue" revenue={revenue} /> */}
        {/* <LatestInvoices key="latestInvoices" latestInvoices={latestInvoices} /> */}
        <WeatherChart key="weatherData" weatherData={weatherData} />
      </div>
    </main>
  );
}