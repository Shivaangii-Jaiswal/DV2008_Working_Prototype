import { Course } from "@/types/module";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Plus, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CourseCardProps {
  course: Course;
  onAdd: (course: Course) => void;
  isAdded: boolean;
}

export const CourseCard = ({ course, onAdd, isAdded }: CourseCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
          <div className="text-left">
            <div className="font-semibold text-sm">{course.code}</div>
            <div className="text-xs text-muted-foreground">{course.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              if (!isAdded) {
                onAdd(course);
              }
            }}
            disabled={isAdded}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-3 text-xs text-muted-foreground space-y-1">
          {course.location && <div>Location: {course.location}</div>}
          {course.teachingWeeks && <div>Teaching Weeks: {course.teachingWeeks}</div>}
          {course.examDate && <div>Exam: {course.examDate}</div>}
        </div>
      )}
    </Card>
  );
};
