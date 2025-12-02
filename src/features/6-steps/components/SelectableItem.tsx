import { Check, Pencil } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SelectableItemProps {
  id: string;
  text: string;
  isSelected?: boolean;
  isEditable?: boolean;
  onEdit?: (id: string, newText: string) => void;
  onSelect?: (id: string) => void;
}

export const SelectableItem = ({
  id,
  text,
  isSelected = false,
  isEditable = false,
  onEdit,
  onSelect,
}: SelectableItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== text && onEdit) {
      onEdit(id, editValue.trim());
    } else {
      setEditValue(text); // Reset if no change
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(text);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleClick = () => {
    if (!isEditing && onSelect) {
      onSelect(id);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className={`w-full pl-3.5 pr-3 py-4 rounded-lg bg-primary-foreground outline outline-1 outline-offset-[-1px] flex justify-between items-center gap-5 transition-all ${
        isSelected
          ? 'outline-secondary'
          : 'outline-slate-100 dark:outline-slate-800'
      } ${onSelect && !isEditing ? 'cursor-pointer hover:outline-secondary' : ''}`}
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
            aria-label="Save"
          >
            <Check className="w-4 h-4 text-green-600" />
          </button>
        </>
      ) : (
        <>
          <div className="flex-1 text-sm font-normal leading-5 text-primary dark:text-foreground">
            {text}
          </div>
          {isEditable && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="flex-shrink-0 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              aria-label="Edit"
            >
              <Pencil className="w-4 h-4 text-primary dark:text-foreground" />
            </button>
          )}
        </>
      )}
    </div>
  );
};
