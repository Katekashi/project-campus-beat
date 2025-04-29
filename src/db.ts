// src/db.ts
export type Student = {
    id: string;
    name: string;
    email: string;
    password: string;
    university: string;
    major: string;
    interests: string[];
    skills: string[];
    hackathonExperience: boolean;
  };
  
  type Club = {
    id: string;
    name: string;
    description: string;
    university: string;
    tags: string[];
    member_count: number;
  };
  
  // Mock Database
  export const db = {
    students: [] as Student[],
    clubs: [] as Club[],
  };
  
  // Initialize with UTD clubs
  export function initializeDB() {
    db.clubs = [
      {
        id: "1",
        name: "180 Degrees Consulting",
        description: "Consulting services for non-profits",
        university: "UT Dallas",
        tags: ["Business", "Consulting"],
        member_count: 45
      },
      {
        id: "2",
        name: "Amazon Web Services Org",
        description: "Learn cloud technologies through workshops",
        university: "UT Dallas",
        tags: ["Technology", "Cloud"],
        member_count: 32
      }
    ];
  }
  
  // Generate test student profiles
  export function generateMockStudents(count: number) {
    const majors = ["CS", "Business", "Engineering"];
    const skills = ["Python", "JavaScript", "Design"];
    
    for (let i = 0; i < count; i++) {
      db.students.push({
        id: `student-${i}`,
        name: `Student ${i}`,
        email: `student${i}@utdallas.edu`,
        password: "password123",
        university: "UT Dallas",
        major: majors[i % majors.length],
        interests: [skills[i % skills.length]],
        skills: [skills[i % skills.length]],
        hackathonExperience: Math.random() > 0.5
      });
    }
  }