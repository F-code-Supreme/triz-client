import { useState } from 'react';

import StepIndicator from '@/components/ui/step-indicator';
import { AdminLayout } from '@/layouts/admin-layout';

import StepBasic from './components/StepBasic';
import StepModules from './components/StepModules';
import StepPlaceholder from './components/StepPlaceholder';

const CreateCoursePage = () => {
  // Step and form state
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailPreview] = useState<string | null>(null);
  const [errors] = useState<{
    title?: string;
    description?: string;
    thumbnail?: string;
  }>({});

  const goNext = () => {
    if (step === 1) {
      setStep(2);
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
            setCourseId={setCourseId}
          />
        )}

        {/* Step 2: Modules */}
        {step === 2 && (
          <StepModules goNext={goNext} goBack={goBack} courseId={courseId} />
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
