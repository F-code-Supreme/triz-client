import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import StepIndicator from '@/components/ui/step-indicator';
import { AdminLayout } from '@/layouts/admin-layout';

import StepBasic from './components/StepBasic';
import StepModules from './components/StepModules';
import StepPlaceholder from './components/StepPlaceholder';

const CreateCoursePage = () => {
  const { t } = useTranslation('pages.admin');
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
    <AdminLayout meta={{ title: t('courses.create.title') }}>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {t('courses.create.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('courses.create.description')}
            </p>
          </div>
        </div>

        {/* Stepper / progress */}
        <div className="w-full">
          <div className="flex items-center space-x-4">
            <StepIndicator
              number={1}
              label={t('courses.create.steps.basic')}
              active={step === 1}
              completed={step > 1}
            />
            <div className="flex-1 h-0.5 bg-gray-200" />
            <StepIndicator
              number={2}
              label={t('courses.create.steps.modules')}
              active={step === 2}
              completed={step > 2}
            />
            <div className="flex-1 h-0.5 bg-gray-200" />
            <StepIndicator
              number={3}
              label={t('courses.create.steps.summary')}
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
