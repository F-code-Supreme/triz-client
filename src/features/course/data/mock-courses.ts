import {
  Course,
  CourseLevel,
  CourseStatus,
  LessonType,
  ResourceType,
} from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced TRIZ Problem Solving Techniques',
    description:
      'Master the Theory of Inventive Problem Solving with hands-on exercises and real-world applications. Learn systematic innovation methods used by top engineers.',
    instructor: 'Dr. Sarah Chen',
    instructorAvatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=400&h=400&fit=crop&crop=face',
    thumbnail:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    category: 'Engineering',
    level: CourseLevel.ADVANCED,
    duration: 24,
    totalLessons: 42,
    progress: 65,
    status: CourseStatus.IN_PROGRESS,
    rating: 4.8,
    totalStudents: 1247,
    price: 199,
    originalPrice: 299,
    isEnrolled: true,
    enrolledAt: '2024-01-15T10:00:00Z',
    lastAccessedAt: '2024-11-05T14:30:00Z',
    weeks: [
      {
        id: 'week-1',
        title: 'TRIZ Fundamentals',
        description: 'Introduction to TRIZ methodology and basic concepts',
        order: 1,
        isUnlocked: true,
        completedLessons: 6,
        totalLessons: 6,
        lessons: [
          {
            id: 'lesson-1-1',
            title: 'What is TRIZ?',
            description: 'Overview of the Theory of Inventive Problem Solving',
            type: LessonType.VIDEO,
            duration: 25,
            order: 1,
            isCompleted: true,
            isUnlocked: true,
            videoUrl: 'https://example.com/video1',
            resources: [
              {
                id: 'res-1',
                title: 'TRIZ Introduction Slides',
                type: ResourceType.PDF,
                url: 'https://example.com/slides1.pdf',
                size: 2048,
              },
            ],
          },
          {
            id: 'lesson-1-2',
            title: 'History and Development',
            type: LessonType.VIDEO,
            duration: 20,
            order: 2,
            isCompleted: true,
            isUnlocked: true,
            videoUrl: 'https://example.com/video2',
          },
          {
            id: 'lesson-1-3',
            title: 'Basic TRIZ Principles',
            type: LessonType.TEXT,
            duration: 30,
            order: 3,
            isCompleted: true,
            isUnlocked: true,
            content: 'Detailed explanation of the 40 inventive principles...',
          },
          {
            id: 'lesson-1-4',
            title: 'Contradiction Analysis',
            type: LessonType.VIDEO,
            duration: 35,
            order: 4,
            isCompleted: true,
            isUnlocked: true,
            videoUrl: 'https://example.com/video3',
          },
          {
            id: 'lesson-1-5',
            title: 'Practice Exercise 1',
            type: LessonType.ASSIGNMENT,
            duration: 45,
            order: 5,
            isCompleted: true,
            isUnlocked: true,
          },
          {
            id: 'lesson-1-6',
            title: 'Week 1 Quiz',
            type: LessonType.QUIZ,
            duration: 15,
            order: 6,
            isCompleted: true,
            isUnlocked: true,
          },
        ],
      },
      {
        id: 'week-2',
        title: 'Algorithm of Inventive Problem Solving (ARIZ)',
        description: 'Deep dive into the systematic approach of ARIZ',
        order: 2,
        isUnlocked: true,
        completedLessons: 4,
        totalLessons: 7,
        lessons: [
          {
            id: 'lesson-2-1',
            title: 'Introduction to ARIZ',
            type: LessonType.VIDEO,
            duration: 30,
            order: 1,
            isCompleted: true,
            isUnlocked: true,
            videoUrl: 'https://example.com/video4',
          },
          {
            id: 'lesson-2-2',
            title: 'Problem Formulation',
            type: LessonType.VIDEO,
            duration: 25,
            order: 2,
            isCompleted: true,
            isUnlocked: true,
            videoUrl: 'https://example.com/video5',
          },
          {
            id: 'lesson-2-3',
            title: 'Solution Development',
            type: LessonType.TEXT,
            duration: 40,
            order: 3,
            isCompleted: true,
            isUnlocked: true,
            content: 'Step-by-step guide to developing solutions using ARIZ...',
          },
          {
            id: 'lesson-2-4',
            title: 'Case Study: Engineering Problem',
            type: LessonType.VIDEO,
            duration: 50,
            order: 4,
            isCompleted: true,
            isUnlocked: true,
            videoUrl: 'https://example.com/video6',
          },
          {
            id: 'lesson-2-5',
            title: 'Practice Exercise 2',
            type: LessonType.ASSIGNMENT,
            duration: 60,
            order: 5,
            isCompleted: false,
            isUnlocked: true,
          },
          {
            id: 'lesson-2-6',
            title: 'Peer Discussion',
            type: LessonType.DISCUSSION,
            duration: 30,
            order: 6,
            isCompleted: false,
            isUnlocked: true,
          },
          {
            id: 'lesson-2-7',
            title: 'Week 2 Assessment',
            type: LessonType.QUIZ,
            duration: 20,
            order: 7,
            isCompleted: false,
            isUnlocked: false,
          },
        ],
      },
      {
        id: 'week-3',
        title: 'Advanced TRIZ Tools',
        description:
          'Explore advanced tools and techniques in TRIZ methodology',
        order: 3,
        isUnlocked: false,
        completedLessons: 0,
        totalLessons: 8,
        lessons: [],
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Introduction to Innovation Management',
    description:
      'Learn the fundamentals of managing innovation processes in organizations. Perfect for beginners in innovation management.',
    instructor: 'Prof. Michael Rodriguez',
    instructorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    thumbnail:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
    category: 'Business',
    level: CourseLevel.BEGINNER,
    duration: 16,
    totalLessons: 28,
    progress: 100,
    status: CourseStatus.COMPLETED,
    rating: 4.6,
    totalStudents: 3421,
    price: 149,
    isEnrolled: true,
    enrolledAt: '2023-11-20T09:00:00Z',
    lastAccessedAt: '2024-02-15T16:45:00Z',
    completedAt: '2024-02-15T16:45:00Z',
    weeks: [],
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2024-10-01T00:00:00Z',
  },
  {
    id: '3',
    title: 'Creative Problem Solving Workshop',
    description:
      'Interactive workshop focusing on creative approaches to problem solving using various methodologies including TRIZ, Design Thinking, and more.',
    instructor: 'Dr. Emma Thompson',
    instructorAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    thumbnail:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
    category: 'Design',
    level: CourseLevel.INTERMEDIATE,
    duration: 20,
    totalLessons: 35,
    progress: 0,
    status: CourseStatus.NOT_STARTED,
    rating: 4.9,
    totalStudents: 892,
    price: 179,
    originalPrice: 229,
    isEnrolled: true,
    enrolledAt: '2024-10-30T12:00:00Z',
    weeks: [],
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2024-10-15T00:00:00Z',
  },
  {
    id: '4',
    title: 'Digital Innovation Strategies',
    description:
      'Explore how digital technologies are transforming innovation processes and learn to develop digital innovation strategies.',
    instructor: 'Alex Johnson',
    instructorAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    thumbnail:
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop',
    category: 'Technology',
    level: CourseLevel.INTERMEDIATE,
    duration: 18,
    totalLessons: 32,
    progress: 25,
    status: CourseStatus.IN_PROGRESS,
    rating: 4.7,
    totalStudents: 1653,
    price: 189,
    isEnrolled: true,
    enrolledAt: '2024-09-15T14:20:00Z',
    lastAccessedAt: '2024-11-03T11:15:00Z',
    weeks: [],
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2024-10-20T00:00:00Z',
  },
];

export const mockCurrentLesson = {
  id: 'lesson-2-5',
  title: 'Practice Exercise 2',
  type: LessonType.ASSIGNMENT,
  content: `
# Practice Exercise 2: Applying ARIZ to Real-World Problems

## Objective
Apply the ARIZ methodology to solve a complex engineering problem involving conflicting requirements.

## Problem Statement
A manufacturing company needs to improve their packaging process. They want to:
- Increase packaging speed (to meet higher demand)
- Reduce material waste (to cut costs)
- Maintain product protection quality

These requirements seem to conflict with each other. Use ARIZ to find an innovative solution.

## Instructions
1. **Problem Analysis**: Identify the technical and physical contradictions
2. **Solution Generation**: Apply ARIZ steps to generate potential solutions
3. **Evaluation**: Assess the feasibility and effectiveness of your solutions
4. **Documentation**: Prepare a comprehensive report of your analysis

## Resources
- ARIZ Step-by-Step Guide (PDF)
- Contradiction Matrix Tool
- Case Study Examples

## Submission Guidelines
Submit your analysis as a PDF document including:
- Problem formulation
- Contradiction analysis
- Solution alternatives
- Recommended solution with justification

**Due Date**: End of Week 2
**Estimated Time**: 60 minutes
  `,
  resources: [
    {
      id: 'res-2-1',
      title: 'ARIZ Step-by-Step Guide',
      type: ResourceType.PDF,
      url: 'https://example.com/ariz-guide.pdf',
      size: 1536,
    },
    {
      id: 'res-2-2',
      title: 'Contradiction Matrix Tool',
      type: ResourceType.LINK,
      url: 'https://example.com/contradiction-matrix',
    },
  ],
};
