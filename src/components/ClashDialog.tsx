import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/module";
import { X } from "lucide-react";

interface ClashDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clashingCourses: Course[];
  onRemoveCourse: (courseId: string) => void;
}

export const ClashDialog = ({ open, onOpenChange, clashingCourses, onRemoveCourse }: ClashDialogProps) => {
  const handleRemove = (courseId: string) => {
    onRemoveCourse(courseId);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Fix Clash Before Proceeding</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>The following courses have overlapping time slots:</p>
            <div className="space-y-2 mt-3">
              {clashingCourses.map(course => (
                <div 
                  key={course.id}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <div>
                    <span className="font-semibold">{course.code}</span> - {course.name}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemove(course.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="mt-3">Please remove one of the clashing courses before proceeding.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Okay</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
