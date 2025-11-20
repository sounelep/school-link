
import React, { useState, useMemo } from 'react';
import { InscriptionTable as InscriptionTableType, User } from '../types';

interface InscriptionTableProps {
  table: InscriptionTableType;
  onRegister: (newSlots: { activityId: string, timeSlotId: string }[]) => void;
  currentUser: User;
  users: User[];
  isGroupAdmin: boolean;
  onExport: (tableId: string) => void;
}

export const InscriptionTable: React.FC<InscriptionTableProps> = ({ table, onRegister, currentUser, users, isGroupAdmin, onExport }) => {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  const userRegistrations = useMemo(() => {
    const registrations = new Set<string>();
    table.slots.forEach(slot => {
      if (slot.registeredUserIds.includes(currentUser.id)) {
        registrations.add(`${slot.activityId}-${slot.timeSlotId}`);
      }
    });
    return registrations;
  }, [table.slots, currentUser.id]);

  const handleSlotClick = (activityId: string, timeSlotId: string) => {
    const slotKey = `${activityId}-${timeSlotId}`;
    const newSelectedSlots = new Set(selectedSlots);
    if (newSelectedSlots.has(slotKey)) {
      newSelectedSlots.delete(slotKey);
    } else {
      newSelectedSlots.add(slotKey);
    }
    setSelectedSlots(newSelectedSlots);
  };

  const handleSave = () => {
    // FIX: Explicitly typing `key` as `string` resolves the type inference issue.
    const newRegistrations = Array.from(selectedSlots).map((key: string) => {
        const [activityId, timeSlotId] = key.split('-');
        return { activityId, timeSlotId };
    });
    onRegister(newRegistrations);
    setSelectedSlots(new Set());
  };

  return (
    <div className="bg-surface rounded-lg shadow-md p-4 sm:p-6 mt-4 border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
        <h3 className="text-xl font-bold text-primary">{table.title}</h3>
        {isGroupAdmin && (
            <button 
                onClick={() => onExport(table.id)}
                className="mt-2 sm:mt-0 bg-secondary hover:bg-secondary-hover text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm">
                Exporter les Inscrits
            </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 sm:p-3 border text-sm font-semibold text-text-secondary">Horaires</th>
              {table.activities.map(activity => (
                <th key={activity.id} className="p-2 sm:p-3 border text-sm font-semibold text-text-secondary">{activity.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.timeSlots.map(timeSlot => (
              <tr key={timeSlot.id} className="even:bg-gray-50">
                <td className="p-2 sm:p-3 border font-medium text-text-primary">{timeSlot.label}</td>
                {table.activities.map(activity => {
                  const slotData = table.slots.find(s => s.activityId === activity.id && s.timeSlotId === timeSlot.id);
                  
                  // Case: No slot or 0 capacity (Not Applicable / Empty)
                  // Changed to lighter gray to distinguish from available slots
                  if (!slotData || slotData.capacity === 0) {
                    return <td key={activity.id} className="p-2 sm:p-3 border bg-gray-50"></td>;
                  }
                  
                  const available = slotData.capacity - slotData.registeredUserIds.length;
                  const isRegistered = userRegistrations.has(`${activity.id}-${timeSlot.id}`);
                  const isSelected = selectedSlots.has(`${activity.id}-${timeSlot.id}`);

                  const canSelect = !isRegistered && available > 0;
                  
                  let cellClass = "p-2 sm:p-3 border transition-all duration-200 ease-in-out relative";
                  
                  // Styles applied based on state
                  if (canSelect) cellClass += " cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800"; // Darker gray for available
                  if (isRegistered) cellClass += " bg-green-200 text-green-800"; // Registered overrides gray
                  if (isSelected) cellClass += " bg-primary/80 text-white ring-2 ring-primary"; // Selected overrides all
                  if (available <= 0 && !isRegistered) cellClass += " bg-red-100 text-red-600"; // Full
                  if (!canSelect && !isRegistered) cellClass += " opacity-60";


                  return (
                    <td key={activity.id} className={cellClass} onClick={() => canSelect && handleSlotClick(activity.id, timeSlot.id)}>
                        {isRegistered ? "Inscrit(e)" : `${available} / ${slotData.capacity}`}
                        {isRegistered && <div className="absolute top-1 right-1 w-3 h-3 bg-secondary rounded-full"></div>}
                        <span className="text-xs block text-text-secondary">
                          {available <= 0 && !isRegistered ? "Complet" : "places"}
                        </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {selectedSlots.size > 0 && (
        <div className="mt-6 text-right">
            <button 
                onClick={handleSave}
                className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-md transition duration-300">
                Enregistrer mes choix ({selectedSlots.size})
            </button>
        </div>
      )}
    </div>
  );
};
