import React, { useState } from 'react'
import { useGetProjects, useCreateProject } from '../api/fastAPI'
import type { ProjectCreate } from '../api/fastAPI.schemas'
import { IxInput, IxButton } from '@siemens/ix-react'

export function ProjectList() {
  const { data, refetch } = useGetProjects()
  const createProject = useCreateProject()
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
          refetch()
        },
      },
    )
  }

  const projects = data?.data ?? []

  return (
    <>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
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
        <IxButton type="submit" style={{ marginTop: '0.5rem' }}>
          Crear proyecto
        </IxButton>
      </form>
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
