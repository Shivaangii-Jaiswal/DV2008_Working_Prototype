import { Course } from "@/types/module";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { DAYS } from "@/types/module";

interface AddedCourseCardProps {
  course: Course;
  onRemove: (courseId: string) => void;
}

export const AddedCourseCard = ({ course, onRemove }: AddedCourseCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-l-4 border-border" style={{ borderLeftColor: `hsl(var(--${course.color}))` }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-start justify-between hover:bg-accent/50 transition-colors text-left"
      >
        <div className="flex items-start gap-2 flex-1">
          <div
            className="w-3 h-3 rounded-sm mt-0.5 flex-shrink-0"
            style={{ backgroundColor: `hsl(var(--${course.color}))` }}
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{course.code} {course.name}</div>
            {course.examDate && (
              <div className="text-xs text-muted-foreground mt-0.5">
                Exam: {course.examDate}
              </div>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-3 text-xs space-y-2 border-t border-border">
          <div className="pt-2 space-y-1 text-muted-foreground">
            {course.slots.map((slot, idx) => (
              <div key={idx}>
                {String(idx + 1).padStart(3, "00")} / {DAYS[slot.day]} {slot.startTime}:00-{slot.startTime + slot.duration}:00
              </div>
            ))}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(course.id);
            }}
            className="text-destructive hover:underline"
          >
            Remove from plan
          </button>
        </div>
      )}
    </Card>
  );
};
