import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Course } from "@/types/module";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Plus, Check, ChevronDown, ChevronRight } from "lucide-react";
import { DAYS } from "@/types/module";

interface CourseCardProps {
  course: Course;
  onAdd: (course: Course) => void;
  isAdded: boolean;
}

export const CourseCard = ({ course, onAdd, isAdded }: CourseCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleInfoClick = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <Card className="border">
      <div className="flex items-center justify-between p-3 gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 flex-1 text-left hover:bg-accent/50 -m-3 p-3 rounded transition-colors"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{course.code}</div>
            <div className="text-xs text-muted-foreground">{course.name}</div>
          </div>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-medium">{course.credits} AU</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full"
            onClick={handleInfoClick}
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={isAdded ? "secondary" : "default"}
            onClick={() => onAdd(course)}
            disabled={isAdded}
            className="h-8 w-8 p-0 rounded-full"
          >
            {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-3 text-xs space-y-2 border-t border-border">
          <div className="pt-2">
            {course.examDate && (
              <div className="text-muted-foreground mb-2">
                Exam: {course.examDate}
              </div>
            )}
            <div className="text-muted-foreground">
                            <div className="text-muted-foreground">
                <div className="font-medium mb-1">Index / Datetime / Vacancies</div>
                {course.slots.map((slot, idx) => (
                  <div key={idx}>
                    {String(idx + 1).padStart(3, "00")} / {DAYS[slot.day]} {String(slot.startTime).padStart(2, "0")}00-{String(slot.startTime + slot.duration).padStart(2, "0")}00 / {course.vacancies || "25"}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
