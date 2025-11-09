import { Course } from "@/types/module";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Info, X, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { DAYS } from "@/types/module";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddedCourseCardProps {
  course: Course;
  selectedSlotIndex: number;
  onRemove: (courseId: string) => void;
  onSelectIndex: (courseId: string, slotIndex: number) => void;
}

export const AddedCourseCard = ({ course, selectedSlotIndex, onRemove, onSelectIndex }: AddedCourseCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [indexSortOrder, setIndexSortOrder] = useState<"index" | "day" | "time">("index");
  const navigate = useNavigate();

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/course/${course.id}`);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(course.id);
  };

  // Sort slots based on selected sort order
  const sortedSlots = course.slots.map((slot, idx) => ({ slot, idx })).sort((a, b) => {
    if (indexSortOrder === "day") {
      return a.slot.day - b.slot.day;
    } else if (indexSortOrder === "time") {
      return a.slot.startTime - b.slot.startTime;
    }
    return a.idx - b.idx; // default: by index
  });

  return (
    <Card className="border-l-4 border-border" style={{ borderLeftColor: `hsl(var(--${course.color}))` }}>
      <div className="p-3 flex items-center gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="hover:bg-accent/50 p-1 rounded transition-colors"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          )}
        </button>
        <div
          className="w-3 h-3 rounded-sm flex-shrink-0"
          style={{ backgroundColor: `hsl(var(--${course.color}))` }}
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{course.code}</div>
          <div className="text-xs text-muted-foreground">{course.name}</div>
          <div className="text-xs font-medium mt-0.5">{course.credits} AU</div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
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
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
            onClick={handleRemoveClick}
          >
            <X className="h-4 w-4" />
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
            <div className="text-muted-foreground mb-2">
              <div className="font-medium mb-1 flex items-center justify-between">
                <span>Index / Datetime / Vacancies</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      <ArrowUpDown className="h-3 w-3 mr-1" />
                      Sort: {indexSortOrder === "index" ? "Index" : indexSortOrder === "day" ? "Day" : "Time"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIndexSortOrder("index")}>
                      <span className={indexSortOrder === "index" ? "font-semibold" : ""}>
                        By Index
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIndexSortOrder("day")}>
                      <span className={indexSortOrder === "day" ? "font-semibold" : ""}>
                        By Day
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIndexSortOrder("time")}>
                      <span className={indexSortOrder === "time" ? "font-semibold" : ""}>
                        By Time
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-1">
                {sortedSlots.map(({ slot, idx }) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectIndex(course.id, idx);
                    }}
                    className={`w-full text-left hover:bg-accent/50 p-1 rounded transition-colors ${
                      idx === selectedSlotIndex ? "font-medium bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    {String(idx + 1).padStart(3, "00")} / {DAYS[slot.day]} {String(slot.startTime).padStart(2, "0")}00-{String(slot.startTime + slot.duration).padStart(2, "0")}00 / {course.vacancies || "25"} {idx === selectedSlotIndex ? "(selected)" : ""}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
