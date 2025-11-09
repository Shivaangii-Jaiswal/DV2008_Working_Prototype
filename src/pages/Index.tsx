import { useState, useEffect } from "react";
import { Course, Plan, TimeSlot } from "@/types/module";
import { Timetable } from "@/components/Timetable";
import { CourseCard } from "@/components/CourseCard";
import { AddedCourseCard } from "@/components/AddedCourseCard";
import { IndexSelectionDialog } from "@/components/IndexSelectionDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AVAILABLE_COURSES } from "@/data/courses";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [plans, setPlans] = useState<Plan[]>([
    { id: "plan1", name: "Plan 1", courseIds: [], selectedSlots: {} },
    { id: "plan2", name: "Plan 2", courseIds: [], selectedSlots: {} },
    { id: "plan3", name: "Plan 3", courseIds: [], selectedSlots: {} },
  ]);
  const [activePlanId, setActivePlanId] = useState("plan1");
  const [searchQuery, setSearchQuery] = useState("");
  const [allCoursesOpen, setAllCoursesOpen] = useState(true);
  const [indexDialogOpen, setIndexDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [courseSortOrder, setCourseSortOrder] = useState<"code" | "name" | "credits">("code");
  const { toast } = useToast();

  const activePlan = plans.find(p => p.id === activePlanId) || plans[0];
  const addedCourses = AVAILABLE_COURSES.filter(c => activePlan.courseIds.includes(c.id));
  
  // Sort added courses based on selected sort order
  const sortedAddedCourses = [...addedCourses].sort((a, b) => {
    if (courseSortOrder === "code") {
      return a.code.localeCompare(b.code);
    } else if (courseSortOrder === "name") {
      return a.name.localeCompare(b.name);
    } else if (courseSortOrder === "credits") {
      return b.credits - a.credits;
    }
    return 0;
  });
  
  const filteredCourses = AVAILABLE_COURSES.filter(course =>
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load data from localStorage
  useEffect(() => {
    const savedPlans = localStorage.getItem("plans");
    const savedActivePlan = localStorage.getItem("activePlanId");
    if (savedPlans) setPlans(JSON.parse(savedPlans));
    if (savedActivePlan) setActivePlanId(savedActivePlan);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("plans", JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem("activePlanId", activePlanId);
  }, [activePlanId]);

  const handleAddCourse = (course: Course) => {
    setPlans(plans.map(plan => 
      plan.id === activePlanId
        ? { 
            ...plan, 
            courseIds: [...plan.courseIds, course.id],
            selectedSlots: { ...plan.selectedSlots, [course.id]: 0 } // Default to first slot
          }
        : plan
    ));
    toast({ title: `${course.code} added to ${activePlan.name}` });
  };

  const handlePlanChange = (newPlanId: string) => {
    setActivePlanId(newPlanId);
  };

  const handleRemoveCourse = (courseId: string) => {
    setPlans(plans.map(plan => 
      plan.id === activePlanId
        ? { 
            ...plan, 
            courseIds: plan.courseIds.filter(id => id !== courseId),
            selectedSlots: Object.fromEntries(
              Object.entries(plan.selectedSlots).filter(([id]) => id !== courseId)
            )
          }
        : plan
    ));
    toast({ title: "Course removed from plan" });
  };

  const handleSelectIndex = (courseId: string, slotIndex: number) => {
    setSelectedCourse(AVAILABLE_COURSES.find(c => c.id === courseId) || null);
    setSelectedSlotIndex(slotIndex);
    setIndexDialogOpen(true);
  };

  const handleConfirmIndex = () => {
    if (!selectedCourse) return;
    
    setPlans(plans.map(plan => 
      plan.id === activePlanId
        ? { 
            ...plan, 
            selectedSlots: { ...plan.selectedSlots, [selectedCourse.id]: selectedSlotIndex }
          }
        : plan
    ));
    toast({ title: `Index ${String(selectedSlotIndex + 1).padStart(3, "00")} selected for ${selectedCourse.code}` });
    setIndexDialogOpen(false);
  };

  const handleClearAll = () => {
    setPlans(plans.map(plan => 
      plan.id === activePlanId
        ? { ...plan, courseIds: [], selectedSlots: {} }
        : plan
    ));
    toast({ title: "All courses cleared from plan" });
  };

  const handleSavePlan = () => {
    toast({ title: `${activePlan.name} saved successfully` });
  };

  const handleRegisterCourses = () => {
    if (addedCourses.length === 0) {
      toast({ 
        title: "No courses to register",
        description: "Please add courses to your plan first",
        variant: "destructive"
      });
      return;
    }
    toast({ 
      title: "Courses registered successfully",
      description: `${addedCourses.length} course${addedCourses.length !== 1 ? 's' : ''} registered`
    });
  };

  // Convert courses to time slots for timetable (only show selected slot)
  const timeSlots = addedCourses.flatMap(course => {
    const selectedIndex = activePlan.selectedSlots[course.id] ?? 0;
    const slot = course.slots[selectedIndex];
    if (!slot) return [];
    
    return [{
      id: `${course.id}-${slot.day}-${slot.startTime}`,
      moduleId: course.id,
      day: slot.day,
      startTime: slot.startTime,
      duration: slot.duration,
      room: course.location,
    }];
  });

  // Convert courses to modules for timetable compatibility
  const modules = addedCourses.map(course => ({
    id: course.id,
    code: course.code,
    name: course.name,
    instructor: course.location || "",
    color: course.color,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">U</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                University Timetable Planner
              </h1>
              <p className="text-sm text-muted-foreground">
                Select courses and build your semester schedule
              </p>
            </div>
          </div>

          {/* Plan Tabs */}
          <Tabs value={activePlanId} onValueChange={handlePlanChange}>
            <TabsList>
              {plans.map(plan => (
                <TabsTrigger key={plan.id} value={plan.id}>
                  {plan.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Main Timetable */}
          <div className="space-y-4">
            <Timetable
              modules={modules}
              timeSlots={timeSlots}
              onSlotClick={() => {}}
              onEmptySlotClick={() => {}}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleRegisterCourses} className="flex-1" variant="default">
                Add/Register Courses
              </Button>
              <Button onClick={handleSavePlan} className="flex-1" variant="default">
                Save Plan
              </Button>
              <Button onClick={handleClearAll} variant="default" className="w-full">
                Clear All
              </Button>
            </div>

            {/* Courses Added */}
            <div className="border border-border rounded-lg bg-card">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-lg">Courses Added</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setCourseSortOrder("code")}>
                      <span className={courseSortOrder === "code" ? "font-semibold" : ""}>
                        Course Code
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCourseSortOrder("name")}>
                      <span className={courseSortOrder === "name" ? "font-semibold" : ""}>
                        Course Name
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCourseSortOrder("credits")}>
                      <span className={courseSortOrder === "credits" ? "font-semibold" : ""}>
                        Credits (AU)
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                {addedCourses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No courses added yet
                  </p>
                ) : (
                  sortedAddedCourses.map(course => (
                    <AddedCourseCard
                      key={course.id}
                      course={course}
                      selectedSlotIndex={activePlan.selectedSlots[course.id] ?? 0}
                      onRemove={handleRemoveCourse}
                      onSelectIndex={handleSelectIndex}
                    />
                  ))
                )}
              </div>
            </div>

            {/* All Courses */}
            <Collapsible open={allCoursesOpen} onOpenChange={setAllCoursesOpen}>
              <div className="border border-border rounded-lg bg-card">
                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`h-5 w-5 transition-transform ${!allCoursesOpen ? '-rotate-90' : ''}`} />
                    <h2 className="font-semibold text-lg">All Courses</h2>
                  </div>
                  <Search className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 border-t border-border">
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {filteredCourses.map(course => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          onAdd={handleAddCourse}
                          isAdded={activePlan.courseIds.includes(course.id)}
                        />
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        </div>
        
        <IndexSelectionDialog
          open={indexDialogOpen}
          onOpenChange={setIndexDialogOpen}
          course={selectedCourse}
          slotIndex={selectedSlotIndex}
          onConfirm={handleConfirmIndex}
        />
      </div>
    </div>
  );
};

export default Index;
