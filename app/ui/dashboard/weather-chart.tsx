import { generateYAxis, generateYAxisWeatherData } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { WeatherData } from '@/app/lib/definitions';
import Link from 'next/link';

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function WeatherChart({
  weatherData,
}: {
  weatherData: WeatherData[];
}) {
  const chartHeight = 350;
  const { yAxisLabels, topLabel } = generateYAxisWeatherData(weatherData);

  if (!weatherData || weatherData.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Weather Data
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {/* NOTE: Uncomment this code in Chapter 7 */}

        {<div className="bg-white px-6">
        {/* Table Header */}
        <div className="header-row">
        </div>
        <div className="flex flex-row items-center justify-between py-4 border-b">
          <div className="flex items-center">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold md:text-base">
              <Link href="?field=city&limit=5">City</Link>
              </p>
              <p className={`${lusitana.className} truncate text-sm font-medium md:text-base`}>
              <Link href="?field=temp&limit=5">Temperature</Link>
              </p>
            </div>
          </div>
          
          <p className={`${lusitana.className} truncate text-sm font-medium md:text-base`}>
          <Link href="?field=humidity&limit=5">Humidity</Link>
          </p>
          <p className={`${lusitana.className} truncate text-sm font-medium md:text-base`}>
          <Link href="?field=pressurepsi&limit=5">Pressure (psi)</Link>
          </p>
        </div>
          {weatherData.map((wd, i) => {
            return (
              <div
                key={wd.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {wd.city}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {wd.temp}
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base text-right`}
                >
                  {wd.humidity}
                </p>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {wd.pressurepsi}
                </p>
              </div>
            );
          })}
        </div>}
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
