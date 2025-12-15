import { Settings, Wrench } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/layouts/admin-layout';

const AdminSystemConfigPage = () => {
  const { t } = useTranslation('pages.admin');
  const [activeTab, setActiveTab] = useState('system-wide');

  const [systemConfig, setSystemConfig] = useState({
    maintenanceMode: false,
    maxUploadSize: '10',
    sessionTimeout: '30',
  });

  const [sixStepConfig, setSixStepConfig] = useState({
    step5TopIdeas: '3',
    step5MinIdeas: '1',
    step5MaxIdeas: '10',
    allowCustomIdeasCount: true,
  });

  const handleSystemConfigSave = () => {
    // TODO: Implement API call to save system config
    // Example: await updateSystemConfig(systemConfig);
  };

  const handleSixStepConfigSave = () => {
    // TODO: Implement API call to save six step config
    // Example: await updateSixStepConfig(sixStepConfig);
  };

  return (
    <AdminLayout
      meta={{
        title: t('system_config.title'),
      }}
    >
      <div className="flex flex-col gap-8 p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('system_config.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('system_config.description')}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="system-wide" className="gap-2">
              <Settings className="h-4 w-4" />
              {t('system_config.tabs.system_wide')}
            </TabsTrigger>
            <TabsTrigger value="six-step" className="gap-2">
              <Wrench className="h-4 w-4" />
              {t('system_config.tabs.six_step')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="system-wide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t('system_config.system_wide.limits.title')}
                </CardTitle>
                <CardDescription>
                  {t('system_config.system_wide.limits.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxUploadSize">
                      {t('system_config.system_wide.limits.max_upload_size')}
                    </Label>
                    <Input
                      id="maxUploadSize"
                      type="number"
                      value={systemConfig.maxUploadSize}
                      onChange={(e) =>
                        setSystemConfig({
                          ...systemConfig,
                          maxUploadSize: e.target.value,
                        })
                      }
                      placeholder="10"
                    />
                    <p className="text-sm text-muted-foreground">
                      {t(
                        'system_config.system_wide.limits.max_upload_size_hint',
                      )}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">
                      {t('system_config.system_wide.limits.session_timeout')}
                    </Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={systemConfig.sessionTimeout}
                      onChange={(e) =>
                        setSystemConfig({
                          ...systemConfig,
                          sessionTimeout: e.target.value,
                        })
                      }
                      placeholder="30"
                    />
                    <p className="text-sm text-muted-foreground">
                      {t(
                        'system_config.system_wide.limits.session_timeout_hint',
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSystemConfigSave}>
                {t('system_config.save_changes')}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="six-step" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('system_config.six_step.step5.title')}</CardTitle>
                <CardDescription>
                  {t('system_config.six_step.step5.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="topIdeas">
                      {t('system_config.six_step.step5.top_ideas')}
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
                      {t('system_config.six_step.step5.top_ideas_hint')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minIdeas">
                      {t('system_config.six_step.step5.min_ideas')}
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
                      {t('system_config.six_step.step5.max_ideas')}
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
              <Button onClick={handleSixStepConfigSave}>
                {t('system_config.save_changes')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSystemConfigPage;
