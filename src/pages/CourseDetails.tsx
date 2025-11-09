import { useParams, useNavigate } from "react-router-dom";
import { AVAILABLE_COURSES } from "@/data/courses";
import { DAYS } from "@/types/module";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, MapPin, Users, BookOpen, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const course = AVAILABLE_COURSES.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Planner
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-[1200px]">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Planner
        </Button>

        {/* Course Title */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.code}</h1>
              <p className="text-xl text-muted-foreground">{course.name}</p>
            </div>
            <Badge className={`${course.color} text-white px-4 py-2 text-lg`}>
              {course.credits} AU
            </Badge>
          </div>
        </div>

        {/* Course Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-semibold">{course.location || "TBA"}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Vacancies</div>
                <div className="font-semibold">{course.vacancies || "TBA"}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Exam Date</div>
                <div className="font-semibold text-sm">
                  {course.examDate || "Not Applicable"}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Teaching Weeks</div>
                <div className="font-semibold">{course.teachingWeeks || "TBA"}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Available Time Slots */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Available Time Slots</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            This course has {course.slots.length} available index{course.slots.length !== 1 ? "es" : ""}. Select the one that fits your schedule best.
          </p>
          
          <div className="space-y-3">
            {course.slots.map((slot, idx) => (
              <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="outline" className="font-mono text-base px-3 py-1">
                    Index {String(idx + 1).padStart(3, "0")}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{DAYS[slot.day]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {String(slot.startTime).padStart(2, "0")}:00 - {String(slot.startTime + slot.duration).padStart(2, "0")}:00
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {slot.duration} {slot.duration === 1 ? "hour" : "hours"}
                  </Badge>
                  <div className="flex items-center gap-2 ml-auto">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{course.vacancies || "25"} vacancies</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Additional Info Section */}
        <Card className="p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4">Course Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Course Code</h3>
              <p className="text-muted-foreground">{course.code}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Course Name</h3>
              <p className="text-muted-foreground">{course.name}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Academic Units</h3>
              <p className="text-muted-foreground">{course.credits} AU</p>
            </div>
            {course.examDate && (
              <div>
                <h3 className="font-semibold mb-2">Examination</h3>
                <p className="text-muted-foreground">{course.examDate}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetails;
