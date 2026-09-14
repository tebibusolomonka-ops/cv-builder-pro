'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { Input, Button } from '@/components/ui'
import { Plus, Trash2, GripVertical, Building2, Calendar, MapPin } from 'lucide-react'
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
import { WorkExperience } from '@/types/resume'

function SortableExperienceItem({ exp, index }: { exp: WorkExperience; index: number }) {
  const { updateWorkExperience, removeWorkExperience } = useResumeStore()
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exp.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateWorkExperience(exp.id, { [e.target.name]: e.target.value })
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
          <h4 className="font-medium text-white">Experience #{index + 1}</h4>
          <button 
            onClick={() => removeWorkExperience(exp.id)}
            className="text-dark-400 hover:text-error-text transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Job Title"
            name="title"
            value={exp.title}
            onChange={handleChange}
            placeholder="e.g. Software Engineer"
          />
          <Input
            label="Company"
            name="company"
            value={exp.company}
            onChange={handleChange}
            placeholder="e.g. Google"
            leftIcon={<Building2 size={18} />}
          />
          <Input
            label="Location"
            name="location"
            value={exp.location}
            onChange={handleChange}
            placeholder="e.g. Remote"
            leftIcon={<MapPin size={18} />}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Start Date"
              name="startDate"
              value={exp.startDate}
              onChange={handleChange}
              placeholder="e.g. Jan 2020"
              leftIcon={<Calendar size={18} />}
            />
            <Input
              label="End Date"
              name="endDate"
              value={exp.endDate}
              onChange={handleChange}
              placeholder="e.g. Present"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={exp.description}
            onChange={handleChange}
            placeholder="• Developed new features...&#10;• Led a team of..."
            className="w-full min-h-[100px] rounded-lg bg-surface-elevated border border-dark-600 text-white px-3 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  )
}

export function ExperienceForm() {
  const { data, addWorkExperience, reorderWorkExperience } = useResumeStore()

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
      const oldIndex = data.workExperience.findIndex((x) => x.id === active.id)
      const newIndex = data.workExperience.findIndex((x) => x.id === over.id)
      reorderWorkExperience(oldIndex, newIndex)
    }
  }

  const handleAdd = () => {
    addWorkExperience({
      id: crypto.randomUUID(),
      company: '',
      title: '',
      jobTitle: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
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
          items={data.workExperience.map((exp) => exp.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {data.workExperience.map((exp, index) => (
              <SortableExperienceItem key={exp.id} exp={exp} index={index} />
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
        Add Work Experience
      </Button>
    </div>
  )
}
