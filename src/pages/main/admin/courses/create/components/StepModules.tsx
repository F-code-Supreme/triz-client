import {
  Plus,
  GripVertical,
  Paperclip,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

type Props = {
  modules: Module[];
  goNext: () => void;
  goBack: () => void;
};

const StepModules: React.FC<Props> = ({ modules, goNext, goBack }) => {
  return (
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
          <div key={module.id} className="border rounded-lg bg-gray-50 p-4">
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
  );
};

export default StepModules;
