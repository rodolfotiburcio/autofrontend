import React, { useState, useRef } from 'react'
import { useGetProjects, useCreateProject } from '../api/fastAPI'
import type { ProjectCreate } from '../api/fastAPI.schemas'
import {
  IxInput,
  IxButton,
  IxModal,
  IxModalHeader,
  IxModalContent,
  IxModalFooter,
} from '@siemens/ix-react'

export function ProjectList() {
  const { data, refetch } = useGetProjects()
  const createProject = useCreateProject()
  const modalRef = useRef<HTMLIxModalElement>(null)
  const [form, setForm] = useState<ProjectCreate>({
    name: '',
    client: '',
    responsible: '',
  })

  const handleChange = (field: keyof ProjectCreate) => (
    event: CustomEvent<{ value: string }> | any,
  ) => {
    const value = event.detail?.value ?? event.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createProject.mutate(
      { data: form },
      {
        onSuccess: () => {
          setForm({ name: '', client: '', responsible: '' })
          modalRef.current?.closeModal()
          refetch()
        },
      },
    )
  }

  const projects = data?.data ?? []

  return (
    <>
      <IxButton onClick={() => modalRef.current?.showModal()} style={{ marginTop: '1rem' }}>
        Nuevo proyecto
      </IxButton>
      <IxModal ref={modalRef} closeOnBackdropClick closeOnEscape>
        <IxModalHeader>Crear proyecto</IxModalHeader>
        <IxModalContent>
          <form id="project-form" onSubmit={handleSubmit}>
            <IxInput
              placeholder="Nombre"
              value={form.name}
              onInput={handleChange('name')}
            />
            <IxInput
              placeholder="Cliente"
              value={form.client}
              onInput={handleChange('client')}
            />
            <IxInput
              placeholder="Responsable"
              value={form.responsible}
              onInput={handleChange('responsible')}
            />
          </form>
        </IxModalContent>
        <IxModalFooter>
          <IxButton onClick={() => modalRef.current?.dismissModal()}>Cancelar</IxButton>
          <IxButton type="submit" form="project-form" style={{ marginLeft: '0.5rem' }}>
            Crear
          </IxButton>
        </IxModalFooter>
      </IxModal>
      <table className="ix-table ix-table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cliente</th>
            <th>Responsable</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.client}</td>
              <td>{p.responsible}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

