import {
  Plus,
  GripVertical,
  Paperclip,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { useRef, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StepIndicator from '@/components/ui/step-indicator';
import { AdminLayout } from '@/layouts/admin-layout';

// Types
type Lesson = {
  id: string;
  number: number;
  title: string;
  published: boolean;
};

type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type Assignment = {
  id: string; // unique
  code: string; // e.g., Quiz 4
  title: string;
  meta: string; // e.g., "2 questions | 10 pts"
  dueDate?: string; // readable date
  completed?: boolean;
};

const CreateCoursePage = () => {
  // Step and form state
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [_, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    thumbnail?: string;
  }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Modules and lessons state
  const [modules, _setModules] = useState<Module[]>([
    {
      id: '1',
      title: 'Module 1: Introduction to Social Media Marketing',
      lessons: [
        {
          id: '1-1',
          number: 1,
          title: 'Overview of Social Media Platforms',
          published: true,
        },
        {
          id: '1-2',
          number: 2,
          title: 'Key Trends in Social Media',
          published: false,
        },
      ],
    },
    {
      id: '2',
      title: 'Module 2: Facebook Marketing',
      lessons: [
        {
          id: '2-1',
          number: 1,
          title: 'Setting Up a Facebook Business Page',
          published: true,
        },
        {
          id: '2-2',
          number: 2,
          title: 'Creating Engaging Facebook Content',
          published: false,
        },
        {
          id: '2-3',
          number: 3,
          title: 'Facebook Ad Types & Objectives',
          published: false,
        },
      ],
    },
    {
      id: '3',
      title: 'Module 3: Instagram Marketing',
      lessons: [
        {
          id: '3-1',
          number: 1,
          title: 'Optimizing Your Instagram Profile',
          published: true,
        },
        {
          id: '3-2',
          number: 2,
          title: 'Instagram Stories for Engagement',
          published: false,
        },
        {
          id: '3-3',
          number: 3,
          title: 'Instagram Stories & Reels for Business',
          published: false,
        },
        {
          id: '3-4',
          number: 4,
          title: 'Instagram Ads: Formats & Targeting',
          published: false,
        },
      ],
    },
  ]);

  // Sample assignments data for Step 3
  const [assignments, _setAssignments] = useState<Assignment[]>([
    {
      id: 'a4',
      code: 'Quiz 4',
      title: 'Create a Facebook Marketing Plan',
      meta: '2 questions | 10 pts',
      dueDate: 'Oct 30, 2024',
      completed: false,
    },
    {
      id: 'a5',
      code: 'Quiz 5',
      title: 'Instagram Story Strategy Analysis',
      meta: '10 questions | 10 pts',
      dueDate: 'Nov 15, 2024',
      completed: false,
    },
    {
      id: 'a6',
      code: 'Quiz 6',
      title: 'Analyze a Social Media Campaign',
      meta: '10 questions | 10 pts',
      dueDate: 'Nov 25, 2024',
      completed: false,
    },
    {
      id: 'a7',
      code: 'Quiz 7',
      title: 'Final Project: Build a Marketing Campaign',
      meta: '10 questions | 10 pts',
      dueDate: 'Dec 10, 2024',
      completed: false,
    },
    {
      id: 'a1',
      code: 'Quiz 1',
      title: 'Social Media Audit Report',
      meta: '10 questions | 10 pts',
      dueDate: 'Sep 30, 2024',
      completed: true,
    },
    {
      id: 'a2',
      code: 'Quiz 2',
      title: 'SEO Optimization Strategy P1',
      meta: '10 questions | 10 pts',
      dueDate: 'Aug 15, 2024',
      completed: true,
    },
    {
      id: 'a3',
      code: 'Quiz 3',
      title: 'SEO Optimization Strategy P2',
      meta: '10 questions | 10 pts',
      dueDate: 'Aug 15, 2024',
      completed: true,
    },
  ]);

  const currentCount = assignments.filter((a) => !a.completed).length;
  const completedCount = assignments.filter((a) => a.completed).length;

  // Handle thumbnail selection and preview
  const handleThumbnailChange = (file?: File) => {
    const chosen =
      file ??
      (fileInputRef.current &&
        fileInputRef.current.files &&
        fileInputRef.current.files[0]);
    if (!chosen) return;
    setThumbnailFile(chosen);
    const reader = new FileReader();
    reader.onload = () => setThumbnailPreview(String(reader.result));
    reader.readAsDataURL(chosen);
    setErrors((prev) => ({ ...prev, thumbnail: undefined }));
  };

  // Basic validation for step 1
  // const _validateStep1 = () => {
  //   const newErrors: typeof errors = {};
  //   if (!thumbnailFile) newErrors.thumbnail = 'Thumbnail is required';
  //   if (!title.trim()) newErrors.title = 'Title is required';
  //   if (!description.trim()) newErrors.description = 'Description is required';
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const goNext = () => {
    if (step === 1) {
      // if (!_validateStep1()) return;
      setStep(2); // advance to next step (placeholder)
      return;
    }
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  return (
    <AdminLayout meta={{ title: 'Admin Manage Course' }}>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create Course</h1>
            <p className="text-muted-foreground">
              Create a new course with multiple modules and assignments.
            </p>
          </div>
        </div>

        {/* Stepper / progress */}
        <div className="w-full">
          <div className="flex items-center space-x-4">
            <StepIndicator
              number={1}
              label="Basic"
              active={step === 1}
              completed={step > 1}
            />
            <div className="flex-1 h-0.5 bg-gray-200" />
            <StepIndicator
              number={2}
              label="Modules"
              active={step === 2}
              completed={step > 2}
            />
            <div className="flex-1 h-0.5 bg-gray-200" />
            <StepIndicator
              number={3}
              label="Assignments"
              active={step === 3}
              completed={step > 3}
            />
            <div className="flex-1 h-0.5 bg-gray-200" />
            <StepIndicator
              number={4}
              label="Publish"
              active={step === 4}
              completed={step > 4}
            />
          </div>
        </div>

        {/* Step 1: Basic info */}
        {step === 1 && (
          <div className="rounded-md border p-6">
            <h2 className="text-lg font-semibold mb-4">Basic information</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Thumbnail */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail
                </label>
                <div
                  role="button"
                  tabIndex={0}
                  className="flex items-center justify-center w-full h-40 border-2 border-dashed rounded-md cursor-pointer overflow-hidden bg-white"
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="thumbnail preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="text-center text-sm text-gray-500 px-4">
                      <p>Click to upload</p>
                      <p className="mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={() => handleThumbnailChange()}
                  className="hidden"
                />
                {errors.thumbnail && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.thumbnail}
                  </p>
                )}
              </div>

              {/* Title + Description */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title)
                        setErrors((prev) => ({ ...prev, title: undefined }));
                    }}
                    className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter course title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-2">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Short Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors.description)
                        setErrors((prev) => ({
                          ...prev,
                          description: undefined,
                        }));
                    }}
                    rows={5}
                    className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write a short description for the course"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-between border-t pt-6">
              <div />
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={step === 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="button" onClick={goNext}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="rounded-md border">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-600 rounded" />
                <h2 className="text-xl font-semibold">Modules</h2>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Module
              </Button>
            </div>

            {/* Modules list */}
            <div className="p-6 space-y-6">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="border rounded-lg bg-gray-50 p-4"
                >
                  {/* Module header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      <h3 className="font-medium text-base">
                        {module.title} ({module.lessons.length}{' '}
                        {module.lessons.length === 1 ? 'lesson' : 'lessons'})
                      </h3>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Lesson
                    </Button>
                  </div>

                  {/* Lessons table */}
                  <div className="bg-white rounded-md border overflow-hidden">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center border-b last:border-b-0 hover:bg-gray-50"
                      >
                        {/* Drag handle */}
                        <div className="flex items-center justify-center w-[72px] h-14 border-r">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                        </div>

                        {/* Lesson number */}
                        <div className="flex items-center w-[111px] h-14 px-4 border-r">
                          <span className="text-blue-600 font-medium">
                            Lesson {lesson.number}
                          </span>
                        </div>

                        {/* Lesson title */}
                        <div className="flex items-center flex-1 h-14 px-4 gap-2 border-r">
                          <Paperclip className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{lesson.title}</span>
                        </div>

                        {/* Status badge */}
                        <div className="flex items-center justify-center w-[157px] h-14 border-r">
                          <Badge
                            variant={lesson.published ? 'default' : 'secondary'}
                            className={
                              lesson.published
                                ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                            }
                          >
                            {lesson.published ? 'Published' : 'Unpublish'}
                          </Badge>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center h-14">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-14 w-14 rounded-none border-r hover:bg-gray-100"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-14 w-14 rounded-none border-r hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-14 w-14 rounded-none hover:bg-gray-100 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer divider and actions */}
            <div className="border-t">
              <div className="flex items-center justify-between p-6">
                <Button variant="outline" onClick={goBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={goNext}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Step 3: Assignments */}
        {step === 3 && (
          <div className="rounded-md border">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-600 rounded" />
                <h2 className="text-xl font-semibold">Assignments</h2>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Quiz
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <Accordion
                type="multiple"
                defaultValue={['current', 'completed']}
                className="space-y-4"
              >
                {/* Current assignments */}
                <AccordionItem
                  value="current"
                  className="border rounded-lg bg-gray-50"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <h3 className="font-medium">
                        Current Assignments ({currentCount})
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="bg-white rounded-md border overflow-hidden">
                      {assignments
                        .filter((a) => !a.completed)
                        .map((a) => (
                          <div
                            key={a.id}
                            className="flex items-center border-b last:border-b-0 hover:bg-gray-50 p-3"
                          >
                            <div className="flex items-center justify-center w-14">
                              <GripVertical className="h-4 w-4 text-gray-400" />
                            </div>

                            <div className="flex-1 px-4">
                              <div className="flex items-center justify-between">
                                <a className="text-sm text-blue-600 font-medium">
                                  {a.code}
                                </a>
                                <div className="ml-4">
                                  <Badge className="bg-green-100 text-green-700">
                                    <Calendar className="mr-2 h-3 w-3" />
                                    {a.dueDate}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {a.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {a.meta}
                              </div>
                            </div>

                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Completed assignments */}
                <AccordionItem
                  value="completed"
                  className="border rounded-lg bg-gray-50"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <h3 className="font-medium">
                        Completed Assignments ({completedCount})
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="bg-white rounded-md border overflow-hidden">
                      {assignments
                        .filter((a) => a.completed)
                        .map((a) => (
                          <div
                            key={a.id}
                            className="flex items-center border-b last:border-b-0 hover:bg-gray-50 p-3"
                          >
                            <div className="flex items-center justify-center w-14">
                              <GripVertical className="h-4 w-4 text-gray-400" />
                            </div>

                            <div className="flex-1 px-4">
                              <div className="flex items-center justify-between">
                                <a className="text-sm text-blue-600 font-medium">
                                  {a.code}
                                </a>
                                <div className="ml-4">
                                  <Badge className="bg-gray-100 text-gray-700">
                                    <Calendar className="mr-2 h-3 w-3" />
                                    {a.dueDate}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {a.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {a.meta}
                              </div>
                            </div>

                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Footer divider and actions */}
            <div className="border-t">
              <div className="flex items-center justify-between p-6">
                <Button variant="outline" onClick={goBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={goNext}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for steps after 3 */}
        {step > 3 && (
          <div className="rounded-md border p-6">
            <h3 className="font-semibold">Step {step} (placeholder)</h3>
            <p className="text-sm text-gray-600 mt-2">
              This is a placeholder for the next steps. You can continue
              implementing them similarly.
            </p>

            <div className="mt-6 flex justify-between border-t pt-6">
              <Button variant="outline" onClick={goBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setStep((s) => s + 1)}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CreateCoursePage;
