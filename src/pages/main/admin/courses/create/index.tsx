import { useState } from 'react';

import StepIndicator from '@/components/ui/step-indicator';
import { AdminLayout } from '@/layouts/admin-layout';

import StepBasic from './components/StepBasic';
import StepModules from './components/StepModules';
import StepPlaceholder from './components/StepPlaceholder';

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
    <AdminLayout meta={{ title: 'Quản lý khóa học' }}>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Tạo khóa học</h1>
            <p className="text-muted-foreground">
              Tạo một khóa học mới với nhiều chương trình và bài tập.
            </p>
          </div>
        </div>

        {/* Stepper / progress */}
        <div className="w-full">
          <div className="flex items-center space-x-4">
            <StepIndicator
              number={1}
              label="Thông tin cơ bản"
              active={step === 1}
              completed={step > 1}
            />
            <div className="flex-1 h-0.5 bg-gray-200" />
            <StepIndicator
              number={2}
              label="Quản lý chương trình"
              active={step === 2}
              completed={step > 2}
            />
            <div className="flex-1 h-0.5 bg-gray-200" />
            <StepIndicator
              number={3}
              label="Xuất bản & Tổng kết"
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
          />
        )}

        {/* Step 2: Modules */}
        {step === 2 && <StepModules goNext={goNext} goBack={goBack} />}

        {/* Step 3: Summary & Publish */}
        {step === 3 && (
          <StepPlaceholder
            goBack={goBack}
            title={title}
            description={description}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default CreateCoursePage;
