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
          slot.startTime + slot.duration + 1 > time
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

  // Calculate grid row position (header is row 1, first time slot starts at row 2)
  const getGridRow = (time: number) => {
    const timeIndex = TIME_SLOTS.indexOf(time);
    return timeIndex + 2; // +2 because row 1 is header
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div 
          className="grid gap-px bg-grid-border rounded-lg overflow-hidden border border-grid-border" 
          style={{ 
            gridTemplateColumns: 'auto repeat(6, 1fr)',
            gridTemplateRows: `auto repeat(${TIME_SLOTS.length}, minmax(60px, auto))`
          }}
        >
          {/* Header Row */}
          <div className="bg-grid-header p-3 font-semibold text-sm" style={{ gridColumn: 1, gridRow: 1 }}>Time</div>
          {DAYS.map((day, idx) => (
            <div key={day} className="bg-grid-header p-3 font-semibold text-sm text-center" style={{ gridColumn: idx + 2, gridRow: 1 }}>
              {day}
            </div>
          ))}

          {/* Time Labels */}
          {TIME_SLOTS.map((time) => (
            <div
              key={`time-${time}`}
              className="bg-card p-3 text-sm text-muted-foreground font-medium"
              style={{ gridColumn: 1, gridRow: getGridRow(time) }}
            >
              {time}:00
            </div>
          ))}

          {/* Course Slots */}
          {TIME_SLOTS.map((time) =>
            DAYS.map((_, dayIndex) => {
              const slotsInCell = getSlotsForCell(dayIndex, time);
              const occupyingSlot = getSlotForCell(dayIndex, time);

              // If this cell is occupied by a slot that started earlier, skip it
              if (occupyingSlot && !isSlotStart(occupyingSlot, time)) {
                return null;
              }

              const gridRowStart = getGridRow(time);

              // If there are multiple slots starting at this time (clash)
              if (slotsInCell.length > 1) {
                const maxDuration = Math.max(...slotsInCell.map(s => s.duration));
                return (
                  <div
                    key={`${dayIndex}-${time}`}
                    className="flex gap-1 p-1 bg-timeslot"
                    style={{
                      gridColumn: dayIndex + 2,
                      gridRow: `${gridRowStart} / ${gridRowStart + maxDuration + 1}`,
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
                            {String(slot.startTime).padStart(2, '0')}:00 - {String(slot.startTime + slot.duration).padStart(2, '0')}:00
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
                if (!module) {
                  return (
                    <div
                      key={`${dayIndex}-${time}`}
                      className="bg-timeslot p-3"
                      style={{
                        gridColumn: dayIndex + 2,
                        gridRow: gridRowStart,
                      }}
                    />
                  );
                }

                const gridRowEnd = gridRowStart + slot.duration + 1;

                return (
                  <button
                    key={`${dayIndex}-${time}`}
                    onClick={() => onSlotClick(slot)}
                    className="p-3 text-left hover:opacity-80 transition-opacity cursor-pointer relative"
                    style={{
                      backgroundColor: `hsl(var(--${module.color}) / 0.15)`,
                      borderLeft: `4px solid hsl(var(--${module.color}))`,
                      gridColumn: dayIndex + 2,
                      gridRow: `${gridRowStart} / ${gridRowEnd}`,
                    }}
                  >
                    <div className="font-semibold text-sm mb-1">{module.code}</div>
                    <div className="text-xs opacity-90">{module.name}</div>
                    {slot.room && (
                      <div className="text-xs opacity-75 mt-1">{slot.room}</div>
                    )}
                    <div className="text-xs opacity-75 mt-1">
                      {String(slot.startTime).padStart(2, '0')}:00 - {String(slot.startTime + slot.duration).padStart(2, '0')}:00
                    </div>
                  </button>
                );
              }

              return (
                <div
                  key={`${dayIndex}-${time}`}
                  className="bg-timeslot p-3"
                  style={{
                    gridColumn: dayIndex + 2,
                    gridRow: gridRowStart,
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
