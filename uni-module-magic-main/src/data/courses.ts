import { Course, MODULE_COLORS } from "@/types/module";

export const AVAILABLE_COURSES: Course[] = [
  {
    id: "cc0001",
    code: "CC0001",
    name: "Course Name 1",
    color: MODULE_COLORS[0].value,
    location: "LT1A",
    teachingWeeks: "1-13",
    slots: [
      { day: 0, startTime: 8, duration: 3 }
    ]
  },
  {
    id: "cc0002",
    code: "CC0002",
    name: "Course Name 2",
    color: MODULE_COLORS[1].value,
    location: "TR+20",
    teachingWeeks: "1-13",
    slots: [
      { day: 1, startTime: 9, duration: 2 }
    ]
  },
  {
    id: "cc0003",
    code: "CC0003",
    name: "Course 3",
    examDate: "Not Applicable",
    color: MODULE_COLORS[2].value,
    location: "LT2A",
    teachingWeeks: "1-13",
    slots: [
      { day: 3, startTime: 9, duration: 3 }
    ]
  },
  {
    id: "cc0004",
    code: "CC0004",
    name: "Course 4",
    examDate: "Not Applicable",
    color: MODULE_COLORS[3].value,
    location: "TR+21",
    teachingWeeks: "1-13",
    slots: [
      { day: 3, startTime: 13, duration: 3 }
    ]
  },
  {
    id: "cc0005",
    code: "CC0005",
    name: "Course 5",
    examDate: "24 Nov 2025",
    color: MODULE_COLORS[4].value,
    location: "LT3",
    teachingWeeks: "1-13",
    slots: [
      { day: 4, startTime: 14, duration: 2 },
      { day: 2, startTime: 10, duration: 2 }
    ]
  },
  {
    id: "cc0006",
    code: "CC0006",
    name: "Course 6",
    color: MODULE_COLORS[5].value,
    location: "TR+22",
    teachingWeeks: "1-13",
    slots: [
      { day: 4, startTime: 14, duration: 2 },
      { day: 1, startTime: 13, duration: 2 }
    ]
  },
  {
    id: "cc0007",
    code: "CC0007",
    name: "Course 7",
    color: MODULE_COLORS[0].value,
    location: "LT4",
    teachingWeeks: "1-13",
    slots: [
      { day: 2, startTime: 16, duration: 2 }
    ]
  },
  {
    id: "cc0008",
    code: "CC0008",
    name: "Course 8",
    color: MODULE_COLORS[1].value,
    location: "TR+25",
    teachingWeeks: "1-13",
    slots: [
      { day: 3, startTime: 8, duration: 1 },
      { day: 5, startTime: 15, duration: 2 }
    ]
  },
];
