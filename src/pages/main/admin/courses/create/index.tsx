import { useState } from 'react';

import StepIndicator from '@/components/ui/step-indicator';
import { AdminLayout } from '@/layouts/admin-layout';

import StepBasic from './components/StepBasic';
import StepModules from './components/StepModules';
import StepPlaceholder from './components/StepPlaceholder';

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

const CreateCoursePage = () => {
  // Step and form state
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailPreview] = useState<string | null>(null);
  const [errors] = useState<{
    title?: string;
    description?: string;
    thumbnail?: string;
  }>({});

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

  // Thumbnail is now provided via StepBasic as a URL input; parent does not handle files.

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
              label="Publish"
              active={step === 3}
              completed={step > 3}
            />
          </div>
        </div>

        {/* Step 1: Basic info */}
        {step === 1 && (
          <StepBasic
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            thumbnailPreview={thumbnailPreview}
            errors={errors}
            goNext={goNext}
            goBack={goBack}
            step={step}
          />
        )}

        {/* Step 2: Modules */}
        {step === 2 && (
          <StepModules modules={modules} goNext={goNext} goBack={goBack} />
        )}

        {/* Steps after 2 (placeholder) */}
        {step > 2 && (
          <StepPlaceholder
            step={step}
            goNext={() => setStep((s) => s + 1)}
            goBack={goBack}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default CreateCoursePage;
