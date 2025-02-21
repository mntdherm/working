import { useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale';
import type { BlockedTime } from '~/types/calendar';

interface AvailabilityManagerProps {
  vendorId: string;
  date: Date;
  blockedTimes: BlockedTime[];
}

export function AvailabilityManager({ vendorId, date, blockedTimes }: AvailabilityManagerProps) {
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const fetcher = useFetcher();

  const todayBlocks = blockedTimes.filter(block => 
    new Date(block.start_time).toDateString() === date.toDateString()
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Saatavuuden hallinta</h3>
        <button
          type="button"
          onClick={() => setIsAddingBlock(!isAddingBlock)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isAddingBlock ? 'Peruuta' : 'Lisää sulkuaika'}
        </button>
      </div>

      {isAddingBlock && (
        <fetcher.Form
          method="post"
          action="/api/availability/block"
          className="space-y-4 mb-6"
        >
          <input type="hidden" name="vendorId" value={vendorId} />
          <input type="hidden" name="date" value={date.toISOString()} />
          
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Alkamisaika
            </label>
            <input
              type="time"
              name="startTime"
              id="startTime"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
              Päättymisaika
            </label>
            <input
              type="time"
              name="endTime"
              id="endTime"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Syy (valinnainen)
            </label>
            <input
              type="text"
              name="reason"
              id="reason"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tallenna
          </button>
        </fetcher.Form>
      )}

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-500">
          Sulkuajat {format(date, 'd.M.yyyy', { locale: fi })}
        </h4>
        
        {todayBlocks.length === 0 ? (
          <p className="text-sm text-gray-500">Ei sulkuaikoja tälle päivälle</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {todayBlocks.map((block) => (
              <li key={block.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(block.start_time), 'HH:mm')} - 
                    {format(new Date(block.end_time), 'HH:mm')}
                  </p>
                  {block.reason && (
                    <p className="text-sm text-gray-500">{block.reason}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    fetcher.submit(
                      { blockId: block.id },
                      { method: 'delete', action: '/api/availability/block' }
                    );
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Poista
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
