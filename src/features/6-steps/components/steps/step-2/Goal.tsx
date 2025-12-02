import { Check, Pencil } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface GoalProps {
  goal: string;
  isSelected?: boolean;
  onEdit?: (newGoal: string) => void;
  onSelect?: () => void;
}

const Goal = ({ goal, isSelected = false, onEdit, onSelect }: GoalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(goal);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== goal && onEdit) {
      onEdit(editValue.trim());
    } else {
      setEditValue(goal); // Reset if no change
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(goal);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      role="button"
      onClick={!isEditing && onSelect ? onSelect : undefined}
      className={`w-full pl-3.5 pr-3 py-4 rounded-lg outline outline-1 outline-offset-[-1px] flex justify-between items-center gap-5 transition-all ${
        isSelected
          ? 'bg-secondary/90 outline-primary'
          : 'bg-secondary-foreground outline-slate-100 dark:outline-slate-800'
      } ${onSelect && !isEditing ? 'cursor-pointer hover:outline-primary/50' : ''}`}
    >
      {isEditing ? (
        <>
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="flex-1 text-primary text-sm font-normal leading-5 bg-transparent outline-none border-b border-primary"
          />
          <button
            onClick={handleSave}
            className="flex-shrink-0 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
            aria-label="Save goal"
          >
            <Check className="w-4 h-4 text-green-600" />
          </button>
        </>
      ) : (
        <>
          <div
            className={`flex-1 text-sm font-normal leading-5 ${
              isSelected
                ? 'text-secondary-foreground'
                : 'text-primary dark:text-foreground'
            }`}
          >
            {goal}
          </div>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="flex-shrink-0 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              aria-label="Edit goal"
            >
              <Pencil
                className={`w-4 h-4 ${
                  isSelected
                    ? 'text-secondary-foreground'
                    : 'text-primary dark:text-foreground'
                }`}
              />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Goal;
