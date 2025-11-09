import { Module } from "@/types/module";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ModuleCardProps {
  module: Module;
  onEdit: (module: Module) => void;
  onDelete: (id: string) => void;
}

export const ModuleCard = ({ module, onEdit, onDelete }: ModuleCardProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div 
            className={`w-4 h-4 rounded-full mt-1 bg-${module.color}`}
            style={{ backgroundColor: `hsl(var(--${module.color}))` }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {module.name}
            </h3>
            <p className="text-sm text-muted-foreground">{module.code}</p>
            <p className="text-sm text-muted-foreground mt-1">{module.instructor}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(module)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(module.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
