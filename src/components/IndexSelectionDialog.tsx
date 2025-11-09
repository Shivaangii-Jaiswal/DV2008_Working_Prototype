import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Course } from "@/types/module";
import { DAYS } from "@/types/module";

interface IndexSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
  slotIndex: number;
  onConfirm: () => void;
}

export const IndexSelectionDialog = ({
  open,
  onOpenChange,
  course,
  slotIndex,
  onConfirm,
}: IndexSelectionDialogProps) => {
  if (!course || !course.slots[slotIndex]) return null;

  const slot = course.slots[slotIndex];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Index Selection</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to select this index for {course.code}?
            <div className="mt-4 p-3 bg-muted rounded-md">
              <div className="font-medium">
                Index {String(slotIndex + 1).padStart(3, "0")}
              </div>
              <div className="text-sm mt-1">
                {DAYS[slot.day]} {String(slot.startTime).padStart(2, "0")}00-
                {String(slot.startTime + slot.duration).padStart(2, "0")}00
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
