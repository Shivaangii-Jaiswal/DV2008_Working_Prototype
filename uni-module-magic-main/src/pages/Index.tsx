import { useState, useEffect } from "react";
import { Course, Plan, TimeSlot } from "@/types/module";
import { Timetable } from "@/components/Timetable";
import { CourseCard } from "@/components/CourseCard";
import { AddedCourseCard } from "@/components/AddedCourseCard";
import { ClashDialog } from "@/components/ClashDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AVAILABLE_COURSES } from "@/data/courses";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [plans, setPlans] = useState<Plan[]>([
    { id: "plan1", name: "Plan 1", courseIds: [] },
    { id: "plan2", name: "Plan 2", courseIds: [] },
    { id: "plan3", name: "Plan 3", courseIds: [] },
  ]);
  const [activePlanId, setActivePlanId] = useState("plan1");
  const [searchQuery, setSearchQuery] = useState("");
  const [clashDialogOpen, setClashDialogOpen] = useState(false);
  const [clashingCourses, setClashingCourses] = useState<Course[]>([]);
  const { toast } = useToast();

  const activePlan = plans.find(p => p.id === activePlanId) || plans[0];
  const addedCourses = AVAILABLE_COURSES.filter(c => activePlan.courseIds.includes(c.id));
  
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

  // Check for clashes whenever courses change
  useEffect(() => {
    const clashes = detectClashes(addedCourses);
    if (clashes.length > 0) {
      setClashingCourses(clashes);
      setClashDialogOpen(true);
    } else {
      setClashingCourses([]);
    }
  }, [addedCourses]);

  const detectClashes = (courses: Course[]): Course[] => {
    const clashingCourseIds = new Set<string>();
    const timeSlotMap = new Map<string, string[]>();

    courses.forEach(course => {
      course.slots.forEach(slot => {
        for (let t = slot.startTime; t < slot.startTime + slot.duration; t++) {
          const key = `${slot.day}-${t}`;
          if (!timeSlotMap.has(key)) {
            timeSlotMap.set(key, []);
          }
          timeSlotMap.get(key)!.push(course.id);
        }
      });
    });

    timeSlotMap.forEach(courseIds => {
      if (courseIds.length > 1) {
        courseIds.forEach(id => clashingCourseIds.add(id));
      }
    });

    return courses.filter(c => clashingCourseIds.has(c.id));
  };

  const handleAddCourse = (course: Course) => {
    // Check if adding this course would create a clash
    const potentialCourses = [...addedCourses, course];
    const clashes = detectClashes(potentialCourses);
    
    if (clashes.length > 0) {
      setClashingCourses(clashes);
      setClashDialogOpen(true);
      return;
    }

    setPlans(plans.map(plan => 
      plan.id === activePlanId
        ? { ...plan, courseIds: [...plan.courseIds, course.id] }
        : plan
    ));
    toast({ title: `${course.code} added to ${activePlan.name}` });
  };

  const handlePlanChange = (newPlanId: string) => {
    const currentClashes = detectClashes(addedCourses);
    if (currentClashes.length > 0) {
      setClashingCourses(currentClashes);
      setClashDialogOpen(true);
      return;
    }
    setActivePlanId(newPlanId);
  };

  const handleRemoveCourse = (courseId: string) => {
    setPlans(plans.map(plan => 
      plan.id === activePlanId
        ? { ...plan, courseIds: plan.courseIds.filter(id => id !== courseId) }
        : plan
    ));
    toast({ title: "Course removed from plan" });
  };

  const handleClearAll = () => {
    setPlans(plans.map(plan => 
      plan.id === activePlanId
        ? { ...plan, courseIds: [] }
        : plan
    ));
    toast({ title: "All courses cleared from plan" });
  };

  const handleSavePlan = () => {
    toast({ title: `${activePlan.name} saved successfully` });
  };

  // Convert courses to time slots for timetable
  const timeSlots = addedCourses.flatMap(course =>
    course.slots.map(slot => ({
      id: `${course.id}-${slot.day}-${slot.startTime}`,
      moduleId: course.id,
      day: slot.day,
      startTime: slot.startTime,
      duration: slot.duration,
      room: course.location,
    }))
  );

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
            {/* Courses Added */}
            <div className="border border-border rounded-lg bg-card">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-lg">Courses Added</h2>
                <Menu className="h-5 w-5" />
              </div>
              <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                {addedCourses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No courses added yet
                  </p>
                ) : (
                  addedCourses.map(course => (
                    <AddedCourseCard
                      key={course.id}
                      course={course}
                      onRemove={handleRemoveCourse}
                    />
                  ))
                )}
              </div>
              <div className="p-4 border-t border-border flex gap-2 flex-wrap">
                <Button onClick={() => {}} className="flex-1" variant="outline">
                  Add/Register Courses
                </Button>
                <Button onClick={handleSavePlan} className="flex-1">
                  Save Plan
                </Button>
                <Button onClick={handleClearAll} variant="outline" className="w-full">
                  Clear All
                </Button>
              </div>
            </div>

            {/* All Courses */}
            <div className="border border-border rounded-lg bg-card">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-lg">All Courses</h2>
                <Menu className="h-5 w-5" />
              </div>
              <div className="p-4">
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
            </div>
          </div>
        </div>

        <ClashDialog
          open={clashDialogOpen}
          onOpenChange={setClashDialogOpen}
          clashingCourses={clashingCourses}
        />
      </div>
    </div>
  );
};

export default Index;
