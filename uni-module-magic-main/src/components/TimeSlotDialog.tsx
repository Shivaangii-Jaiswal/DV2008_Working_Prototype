import { useState, useEffect } from "react";
import { TimeSlot, Module, DAYS, TIME_SLOTS } from "@/types/module";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (timeSlot: Omit<TimeSlot, "id"> & { id?: string }) => void;
  modules: Module[];
  editingSlot?: TimeSlot | null;
  preselectedDay?: number;
  preselectedTime?: number;
}

export const TimeSlotDialog = ({
  open,
  onOpenChange,
  onSave,
  modules,
  editingSlot,
  preselectedDay,
  preselectedTime,
}: TimeSlotDialogProps) => {
  const [formData, setFormData] = useState({
    moduleId: "",
    day: preselectedDay ?? 0,
    startTime: preselectedTime ?? 8,
    duration: 1,
    room: "",
  });

  useEffect(() => {
    if (editingSlot) {
      setFormData({
        moduleId: editingSlot.moduleId,
        day: editingSlot.day,
        startTime: editingSlot.startTime,
        duration: editingSlot.duration,
        room: editingSlot.room || "",
      });
    } else if (open) {
      setFormData({
        moduleId: modules[0]?.id || "",
        day: preselectedDay ?? 0,
        startTime: preselectedTime ?? 8,
        duration: 1,
        room: "",
      });
    }
  }, [editingSlot, open, modules, preselectedDay, preselectedTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      ...(editingSlot && { id: editingSlot.id }),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingSlot ? "Edit Class" : "Add Class"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="module">Module</Label>
              <Select
                value={formData.moduleId}
                onValueChange={(value) =>
                  setFormData({ ...formData, moduleId: value })
                }
                required
              >
                <SelectTrigger id="module">
                  <SelectValue placeholder="Select a module" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.code} - {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="day">Day</Label>
              <Select
                value={formData.day.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, day: parseInt(value) })
                }
              >
                <SelectTrigger id="day">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {DAYS.map((day, index) => (
                    <SelectItem key={day} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Select
                value={formData.startTime.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, startTime: parseInt(value) })
                }
              >
                <SelectTrigger id="startTime">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time.toString()}>
                      {time}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Select
                value={formData.duration.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, duration: parseFloat(value) })
                }
              >
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="0.5">30 minutes</SelectItem>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="1.5">1.5 hours</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="2.5">2.5 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="room">Room (optional)</Label>
              <Input
                id="room"
                value={formData.room}
                onChange={(e) =>
                  setFormData({ ...formData, room: e.target.value })
                }
                placeholder="e.g., Room 101"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {editingSlot ? "Update" : "Add"} Class
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
