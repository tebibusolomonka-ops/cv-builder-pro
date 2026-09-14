'use client'

import { useState, useSyncExternalStore } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MoreVertical, Building2, MapPin, Calendar, Trash2, Edit } from 'lucide-react'
import { Button, Card, Badge, Input, Dropdown, Modal } from '@/components/ui'
import { useApplicationStore, ApplicationStatus, JobApplication } from '@/store/useApplicationStore'
import { formatDistanceToNow } from 'date-fns'

const COLUMNS: { id: ApplicationStatus; label: string; color: string; border: string }[] = [
  { id: 'WISHLIST', label: 'Wishlist', color: 'bg-surface-elevated', border: 'border-dark-500' },
  { id: 'APPLIED', label: 'Applied', color: 'bg-info/10', border: 'border-info/25' },
  { id: 'INTERVIEWING', label: 'Interviewing', color: 'bg-warning/10', border: 'border-warning/25' },
  { id: 'OFFER', label: 'Offer', color: 'bg-success/10', border: 'border-success/25' },
  { id: 'REJECTED', label: 'Rejected', color: 'bg-error/10', border: 'border-error/25' },
]

const emptySubscribe = () => () => {}
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false)
}

export default function ApplicationsPage() {
  const { applications, addApplication, updateApplication, deleteApplication, moveApplication } = useApplicationStore()
  const mounted = useMounted()
  const [draggedId, setDraggedId] = useState<string | null>(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null)
  const [formData, setFormData] = useState<Partial<JobApplication>>({
    company: '',
    role: '',
    status: 'WISHLIST',
    location: '',
    salary: '',
  })

  const handleDragStart = (id: string) => setDraggedId(id)
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // Necessary to allow dropping
  }

  const handleDrop = (status: ApplicationStatus) => {
    if (draggedId) {
      moveApplication(draggedId, status)
      setDraggedId(null)
    }
  }

  const openNewModal = (status: ApplicationStatus = 'WISHLIST') => {
    setEditingApp(null)
    setFormData({ company: '', role: '', status, location: '', salary: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (app: JobApplication) => {
    setEditingApp(app)
    setFormData(app)
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.company || !formData.role) return
    
    if (editingApp) {
      updateApplication(editingApp.id, formData)
    } else {
      addApplication({
        company: formData.company,
        role: formData.role,
        status: formData.status as ApplicationStatus,
        location: formData.location,
        salary: formData.salary,
        dateApplied: new Date().toISOString()
      })
    }
    setIsModalOpen(false)
  }

  if (!mounted) return null

  return (
    <div className="h-full flex flex-col space-y-6 w-full overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-dark-100 font-heading">
            Job Applications
          </h1>
          <p className="text-dark-400 mt-1">Track your job search progress (Local Storage)</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => openNewModal('WISHLIST')}>
          Add Application
        </Button>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-start">
        {COLUMNS.map((col) => {
          const columnApps = applications.filter(a => a.status === col.id)
          
          return (
            <div 
              key={col.id} 
              className={`flex-shrink-0 w-80 rounded-2xl border ${col.border} bg-dark-800/50 flex flex-col min-h-[500px] max-h-[calc(100vh-12rem)] overflow-hidden`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
            >
              <div className={`p-4 border-b ${col.border} flex items-center justify-between rounded-t-2xl ${col.color}`}>
                <h3 className="font-semibold text-dark-100">{col.label}</h3>
                <Badge variant="default" className="bg-dark-800/50">{columnApps.length}</Badge>
              </div>

              <div className="p-4 flex-1 flex flex-col gap-3 overflow-y-auto">
                <AnimatePresence>
                  {columnApps.map(app => (
                    <motion.div
                      key={app.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      draggable
                      onDragStart={() => handleDragStart(app.id)}
                      onDragEnd={() => setDraggedId(null)}
                      className={`cursor-grab active:cursor-grabbing ${draggedId === app.id ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <Card className="p-4 hover:border-primary-500/50 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-dark-100 line-clamp-1 pr-4">{app.role}</h4>
                          <Dropdown
                            align="right"
                            trigger={
                              <button
                                type="button"
                                aria-label={`Actions for ${app.role} at ${app.company}`}
                                className="text-dark-400 hover:text-dark-100 transition-colors"
                              >
                                <MoreVertical size={16} aria-hidden="true" />
                              </button>
                            }
                            items={[
                              { label: 'Edit', value: 'edit', icon: <Edit size={14} />, onClick: () => openEditModal(app) },
                              { label: 'Delete', value: 'delete', icon: <Trash2 size={14} />, danger: true, divider: true, onClick: () => deleteApplication(app.id) },
                            ]}
                          />
                        </div>
                        
                        <div className="space-y-2 mt-3">
                          <div className="flex items-center text-sm text-dark-300">
                            <Building2 size={14} className="mr-2 text-dark-400 shrink-0" />
                            <span className="truncate">{app.company}</span>
                          </div>
                          
                          {app.location && (
                            <div className="flex items-center text-sm text-dark-300">
                              <MapPin size={14} className="mr-2 text-dark-400 shrink-0" />
                              <span className="truncate">{app.location}</span>
                            </div>
                          )}
                          
                          {app.dateApplied && (
                            <div className="flex items-center text-sm text-dark-400 mt-4">
                              <Calendar size={12} className="mr-1.5 shrink-0" />
                              <span className="text-xs">
                                {formatDistanceToNow(new Date(app.dateApplied))} ago
                              </span>
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {columnApps.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-dark-400 p-6 text-center border-2 border-dashed border-dark-700 rounded-xl">
                    <p className="text-sm">Drop here</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingApp ? 'Edit Application' : 'Add Application'}
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Company Name *"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g. Google"
          />
          <Input
            label="Role *"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g. Frontend Engineer"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Remote"
            />
            <Input
              label="Salary"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="e.g. $120k"
            />
          </div>
          <div>
            <label htmlFor="application-status" className="block text-sm font-medium text-dark-200 mb-1">
              Status
            </label>
            <select
              id="application-status"
              className="w-full rounded-lg bg-surface-elevated border border-dark-500 text-dark-100 px-3 py-2 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
            >
              {COLUMNS.map(col => (
                <option key={col.id} value={col.id}>{col.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={!formData.company || !formData.role}>
            {editingApp ? 'Save Changes' : 'Add Application'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
