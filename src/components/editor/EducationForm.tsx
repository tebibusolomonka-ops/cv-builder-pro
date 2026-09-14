'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { Input, Button } from '@/components/ui'
import { Plus, Trash2, GripVertical, GraduationCap, Calendar, MapPin } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Education } from '@/types/resume'

function SortableEducationItem({ edu, index }: { edu: Education; index: number }) {
  const { updateEducation, removeEducation } = useResumeStore()
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: edu.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateEducation(edu.id, { [e.target.name]: e.target.value })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-5 rounded-xl border ${isDragging ? 'border-primary-500 bg-surface-elevated shadow-2xl' : 'border-dark-700 bg-surface-elevated'} transition-colors`}
    >
      <div className="absolute left-2 top-6 cursor-grab active:cursor-grabbing text-dark-400 hover:text-white" {...attributes} {...listeners}>
        <GripVertical size={20} />
      </div>
      
      <div className="ml-6 space-y-4">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-white">Education #{index + 1}</h4>
          <button 
            onClick={() => removeEducation(edu.id)}
            className="text-dark-400 hover:text-error-text transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Degree / Field of Study"
            name="degree"
            value={edu.degree}
            onChange={handleChange}
            placeholder="e.g. BS in Computer Science"
          />
          <Input
            label="School / University"
            name="school"
            value={edu.school}
            onChange={handleChange}
            placeholder="e.g. Stanford University"
            leftIcon={<GraduationCap size={18} />}
          />
          <Input
            label="Location"
            name="location"
            value={edu.location}
            onChange={handleChange}
            placeholder="e.g. Stanford, CA"
            leftIcon={<MapPin size={18} />}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Start Date"
              name="startDate"
              value={edu.startDate}
              onChange={handleChange}
              placeholder="e.g. 2016"
              leftIcon={<Calendar size={18} />}
            />
            <Input
              label="End Date"
              name="endDate"
              value={edu.endDate}
              onChange={handleChange}
              placeholder="e.g. 2020"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function EducationForm() {
  const { data, addEducation, reorderEducation } = useResumeStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    if (active.id !== over.id) {
      const oldIndex = data.education.findIndex((x) => x.id === active.id)
      const newIndex = data.education.findIndex((x) => x.id === over.id)
      reorderEducation(oldIndex, newIndex)
    }
  }

  const handleAdd = () => {
    addEducation({
      id: crypto.randomUUID(),
      school: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: '',
    })
  }

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.education.map((edu) => edu.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <SortableEducationItem key={edu.id} edu={edu} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        variant="outline"
        fullWidth
        onClick={handleAdd}
        className="border-dashed border-dark-600 hover:border-primary-500 hover:bg-primary-500/10 text-dark-300 hover:text-white"
      >
        <Plus size={18} className="mr-2" />
        Add Education
      </Button>
    </div>
  )
}
