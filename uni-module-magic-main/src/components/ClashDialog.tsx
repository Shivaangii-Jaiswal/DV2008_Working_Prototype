import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Course } from "@/types/module";

interface ClashDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clashingCourses: Course[];
}

export const ClashDialog = ({ open, onOpenChange, clashingCourses }: ClashDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Fix Clash Before Proceeding</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>The following courses have overlapping time slots:</p>
            <ul className="list-disc pl-6 space-y-1">
              {clashingCourses.map(course => (
                <li key={course.id}>
                  <span className="font-semibold">{course.code}</span> - {course.name}
                </li>
              ))}
            </ul>
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
