import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExpertLayout } from '@/layouts/expert-layout';

const ExpertSixStepConfigPage = () => {
  const { t } = useTranslation('pages.expert');

  const [sixStepConfig, setSixStepConfig] = useState({
    step5TopIdeas: '3',
    step5MinIdeas: '1',
    step5MaxIdeas: '10',
    allowCustomIdeasCount: true,
  });

  const handleSave = () => {
    // TODO: Implement API call to save six step config
    // Example: await updateSixStepConfig(sixStepConfig);
  };

  return (
    <ExpertLayout
      meta={{
        title: t('six_step_config.title'),
      }}
    >
      <div className="flex flex-col gap-8 p-8">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('six_step_config.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('six_step_config.description')}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('six_step_config.step5.title')}</CardTitle>
              <CardDescription>
                {t('six_step_config.step5.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="topIdeas">
                    {t('six_step_config.step5.top_ideas')}
                  </Label>
                  <Input
                    id="topIdeas"
                    type="number"
                    value={sixStepConfig.step5TopIdeas}
                    onChange={(e) =>
                      setSixStepConfig({
                        ...sixStepConfig,
                        step5TopIdeas: e.target.value,
                      })
                    }
                    min={sixStepConfig.step5MinIdeas}
                    max={sixStepConfig.step5MaxIdeas}
                  />
                  <p className="text-sm text-muted-foreground">
                    {t('six_step_config.step5.top_ideas_hint')}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minIdeas">
                    {t('six_step_config.step5.min_ideas')}
                  </Label>
                  <Input
                    id="minIdeas"
                    type="number"
                    value={sixStepConfig.step5MinIdeas}
                    onChange={(e) =>
                      setSixStepConfig({
                        ...sixStepConfig,
                        step5MinIdeas: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxIdeas">
                    {t('six_step_config.step5.max_ideas')}
                  </Label>
                  <Input
                    id="maxIdeas"
                    type="number"
                    value={sixStepConfig.step5MaxIdeas}
                    onChange={(e) =>
                      setSixStepConfig({
                        ...sixStepConfig,
                        step5MaxIdeas: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              {t('six_step_config.save_changes')}
            </Button>
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertSixStepConfigPage;
