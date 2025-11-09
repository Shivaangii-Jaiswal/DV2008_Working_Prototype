import { useState, useEffect } from "react";
import { Module, MODULE_COLORS } from "@/types/module";
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

interface ModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (module: Omit<Module, "id"> & { id?: string }) => void;
  editingModule?: Module | null;
}

export const ModuleDialog = ({
  open,
  onOpenChange,
  onSave,
  editingModule,
}: ModuleDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    instructor: "",
    color: MODULE_COLORS[0].value,
  });

  useEffect(() => {
    if (editingModule) {
      setFormData({
        name: editingModule.name,
        code: editingModule.code,
        instructor: editingModule.instructor,
        color: editingModule.color,
      });
    } else {
      setFormData({
        name: "",
        code: "",
        instructor: "",
        color: MODULE_COLORS[0].value,
      });
    }
  }, [editingModule, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      ...(editingModule && { id: editingModule.id }),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingModule ? "Edit Module" : "Add New Module"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Module Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Advanced Algorithms"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Module Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="e.g., CS301"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) =>
                  setFormData({ ...formData, instructor: e.target.value })
                }
                placeholder="e.g., Dr. Smith"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex gap-2 flex-wrap">
                {MODULE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-8 h-8 rounded-full transition-all ${
                      formData.color === color.value
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                    style={{ backgroundColor: `hsl(var(--${color.value}))` }}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {editingModule ? "Update" : "Add"} Module
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
