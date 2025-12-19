import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  PenTool,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  CheckCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import type { EnhancedModule } from '@/features/courses/types';

interface CourseSidebarProps {
  modules: EnhancedModule[];
  currentItemId?: string;
  currentModuleId?: string;
  onItemSelect: (itemId: string, moduleId: string) => void;
  onModuleSelect?: (moduleId: string) => void;
  className?: string;
  completedItemIds?: string[];
}

const CourseSidebar = ({
  modules,
  currentItemId,
  currentModuleId,
  onItemSelect,
  onModuleSelect,
  className,
  completedItemIds = [],
}: CourseSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentModuleId) {
      setOpenModules(new Set([currentModuleId]));
    }
  }, [currentModuleId]);

  useEffect(() => {
    if (!currentItemId && !currentModuleId && modules.length > 0) {
      const firstModule = modules[0];
      if (firstModule && firstModule.contents.length > 0) {
        const sortedContents = sortContents(firstModule.contents);
        const firstItem = sortedContents[0];
        if (firstItem) {
          onItemSelect(firstItem.id, firstModule.id);
          setOpenModules(new Set([firstModule.id]));
        }
      }
    }
  }, [currentItemId, currentModuleId, modules, onItemSelect]);

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return Newspaper;
      case 'quiz':
        return PenTool;
      case 'assignment':
        return FileText;
      default:
        return FileText;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'EASY':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'MEDIUM':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'HARD':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const sortContents = (contents: any[]) => {
    const order = { lesson: 0, assignment: 1, quiz: 2 };
    const maxOrder = Object.keys(order).length;
    return [...contents].sort(
      (a, b) =>
        (order[a.type as keyof typeof order] ?? maxOrder) -
        (order[b.type as keyof typeof order] ?? maxOrder),
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '60px' : '320px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'relative bg-card border-r h-full flex-shrink-0',
        className,
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      <AnimatePresence mode="wait">
        {!isCollapsed ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {/* Header */}
            <div className="p-4 border-b">
              <h2 className="text-base font-semibold text-foreground">
                Mục lục khóa học
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {modules.length} Chương học
              </p>
            </div>

            <ScrollArea className="h-[calc(100vh-9rem)]">
              <div className="p-3 space-y-2">
                {modules.map((module, moduleIndex) => {
                  const isCurrentModule = module.id === currentModuleId;
                  const isOpen = openModules.has(module.id);
                  const isModuleCompleted = module.isCompleted;
                  return (
                    <Collapsible
                      key={module.id}
                      open={isOpen}
                      onOpenChange={(open) => {
                        setOpenModules((prev) => {
                          const newSet = new Set(prev);
                          if (open) {
                            newSet.add(module.id);
                          } else {
                            newSet.delete(module.id);
                          }
                          return newSet;
                        });
                      }}
                    >
                      <CollapsibleTrigger className="w-full group">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: moduleIndex * 0.05,
                          }}
                          onClick={() => onModuleSelect?.(module.id)}
                          className={cn(
                            'w-full p-3 rounded-lg border text-left hover:bg-accent/50 transition-colors',
                            isCurrentModule && 'border-primary/50 bg-primary/5',
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div
                                className={cn(
                                  'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                                  isCurrentModule
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground',
                                )}
                              >
                                {moduleIndex + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-sm text-foreground line-clamp-1">
                                    {module.name}
                                  </h3>
                                  {isModuleCompleted && (
                                    <CheckCircle
                                      className="w-4 h-4 text-green-500 flex-shrink-0"
                                      strokeWidth={2.2}
                                      fill="none"
                                    />
                                  )}
                                </div>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'text-[10px] mt-1 h-4 px-1.5',
                                    getLevelColor(module.level),
                                  )}
                                >
                                  {module.level}
                                </Badge>
                              </div>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 flex-shrink-0" />
                          </div>
                        </motion.div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="ml-2 mt-1 space-y-1">
                          {sortContents(module.contents).map(
                            (item, itemIndex) => {
                              const Icon = getItemIcon(item.type);
                              const isCurrentItem = item.id === currentItemId;
                              const isCompleted = completedItemIds.includes(
                                item.id,
                              );
                              return (
                                <motion.button
                                  key={item.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: itemIndex * 0.03,
                                  }}
                                  onClick={() =>
                                    onItemSelect(item.id, module.id)
                                  }
                                  className={cn(
                                    'w-full p-2.5 rounded-md text-left transition-all',
                                    isCurrentItem
                                      ? 'bg-primary text-primary-foreground shadow-sm'
                                      : 'hover:bg-accent',
                                  )}
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {isCompleted ? (
                                      <CheckCircle
                                        className="w-4 h-4 text-green-500 flex-shrink-0"
                                        strokeWidth={2.2}
                                        fill="none"
                                      />
                                    ) : (
                                      <Icon
                                        className={cn(
                                          'w-4 h-4 flex-shrink-0',
                                          isCurrentItem
                                            ? 'text-primary-foreground'
                                            : 'text-muted-foreground',
                                        )}
                                      />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h4
                                        className={cn(
                                          'font-medium text-xs line-clamp-2',
                                          isCurrentItem
                                            ? 'text-primary-foreground'
                                            : 'text-foreground',
                                        )}
                                      >
                                        {item.title}
                                      </h4>
                                    </div>
                                    {/* {isCompleted && (
                                      <CheckCircle
                                        className="w-4 h-4 text-green-500 ml-2 flex-shrink-0"
                                        strokeWidth={2.2}
                                        fill="none"
                                      />
                                    )} */}
                                  </div>
                                </motion.button>
                              );
                            },
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </ScrollArea>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <div className="flex flex-col items-center pt-16 gap-4">
              {modules.map((module, index) => {
                const isCurrentModule = module.id === currentModuleId;
                const isModuleCompleted = module.isCompleted;
                return (
                  <div key={module.id} className="relative">
                    <button
                      onClick={() => onModuleSelect?.(module.id)}
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors cursor-pointer',
                        isCurrentModule
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-accent',
                      )}
                      title={module.name}
                    >
                      {index + 1}
                    </button>
                    {isModuleCompleted && (
                      <CheckCircle
                        className="w-3 h-3 text-green-500 absolute -top-1 -right-1 bg-background rounded-full"
                        strokeWidth={3}
                        fill="none"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CourseSidebar;
