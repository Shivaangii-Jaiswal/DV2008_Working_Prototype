import { Module, TimeSlot, DAYS, TIME_SLOTS } from "@/types/module";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimetableProps {
  modules: Module[];
  timeSlots: TimeSlot[];
  onSlotClick: (slot: TimeSlot) => void;
  onEmptySlotClick: (day: number, time: number) => void;
}

export const Timetable = ({
  modules,
  timeSlots,
  onSlotClick,
  onEmptySlotClick,
}: TimetableProps) => {
  const getSlotForCell = (day: number, time: number): TimeSlot | null => {
    return (
      timeSlots.find(
        (slot) =>
          slot.day === day &&
          slot.startTime <= time &&
          slot.startTime + slot.duration > time
      ) || null
    );
  };

  const getModuleForSlot = (slot: TimeSlot): Module | undefined => {
    return modules.find((m) => m.id === slot.moduleId);
  };

  const isSlotStart = (slot: TimeSlot, time: number): boolean => {
    return slot.startTime === time;
  };

  const getSlotsForCell = (day: number, time: number): TimeSlot[] => {
    return timeSlots.filter(
      (slot) =>
        slot.day === day &&
        slot.startTime === time
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-7 gap-px bg-grid-border rounded-lg overflow-hidden border border-grid-border">
          {/* Header Row */}
          <div className="bg-grid-header p-3 font-semibold text-sm">Time</div>
          {DAYS.map((day) => (
            <div key={day} className="bg-grid-header p-3 font-semibold text-sm text-center">
              {day}
            </div>
          ))}

          {/* Time Slots */}
          {TIME_SLOTS.map((time) => (
            <>
              <div
                key={`time-${time}`}
                className="bg-card p-3 text-sm text-muted-foreground font-medium"
              >
                {time}:00
              </div>
              {DAYS.map((_, dayIndex) => {
                const slotsInCell = getSlotsForCell(dayIndex, time);
                const occupyingSlot = getSlotForCell(dayIndex, time);

                // If this cell is occupied by a slot that started earlier, skip it
                if (occupyingSlot && !isSlotStart(occupyingSlot, time)) {
                  return null;
                }

                // If there are multiple slots starting at this time (clash)
                if (slotsInCell.length > 1) {
                  return (
                    <div
                      key={`${dayIndex}-${time}`}
                      className="flex gap-1 p-1 bg-timeslot"
                      style={{
                        gridRow: `span ${Math.max(...slotsInCell.map(s => s.duration))}`,
                      }}
                    >
                      {slotsInCell.map((slot) => {
                        const module = getModuleForSlot(slot);
                        if (!module) return null;
                        return (
                          <button
                            key={slot.id}
                            onClick={() => onSlotClick(slot)}
                            className="flex-1 p-2 text-left hover:opacity-80 transition-opacity cursor-pointer relative border-2 border-red-500"
                            style={{
                              backgroundColor: `hsl(var(--${module.color}) / 0.15)`,
                              borderLeft: `4px solid hsl(var(--${module.color}))`,
                            }}
                          >
                            <div className="font-semibold text-xs mb-1">{module.code}</div>
                            <div className="text-xs opacity-90 line-clamp-2">{module.name}</div>
                            {slot.room && (
                              <div className="text-xs opacity-75 mt-1">{slot.room}</div>
                            )}
                            <div className="text-xs opacity-75 mt-1">
                              {slot.startTime}:00 - {slot.startTime + slot.duration}:00
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                }

                // Single slot or empty cell
                if (slotsInCell.length === 1) {
                  const slot = slotsInCell[0];
                  const module = getModuleForSlot(slot);
                  if (!module) return null;

                  return (
                    <button
                      key={`${dayIndex}-${time}`}
                      onClick={() => onSlotClick(slot)}
                      className="p-3 text-left hover:opacity-80 transition-opacity cursor-pointer relative"
                      style={{
                        backgroundColor: `hsl(var(--${module.color}) / 0.15)`,
                        borderLeft: `4px solid hsl(var(--${module.color}))`,
                        gridRow: `span ${slot.duration}`,
                      }}
                    >
                      <div className="font-semibold text-sm mb-1">{module.code}</div>
                      <div className="text-xs opacity-90">{module.name}</div>
                      {slot.room && (
                        <div className="text-xs opacity-75 mt-1">{slot.room}</div>
                      )}
                      <div className="text-xs opacity-75 mt-1">
                        {slot.startTime}:00 - {slot.startTime + slot.duration}:00
                      </div>
                    </button>
                  );
                }

                return (
                  <div
                    key={`${dayIndex}-${time}`}
                    className="bg-timeslot p-3"
                  />
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};
