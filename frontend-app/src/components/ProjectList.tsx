import React, { useState, useRef } from 'react'
import {
  useGetProjects,
  useCreateProject,
  useGetClients,
  useGetWorkers,
} from '../api/fastAPI'
import type { ProjectCreate } from '../api/fastAPI.schemas'
import {
  IxInput,
  IxSelect,
  IxSelectItem,
  IxButton,
  IxModal,
  IxModalHeader,
  IxModalContent,
  IxModalFooter,
} from '@siemens/ix-react'

export function ProjectList() {
  const { data, refetch } = useGetProjects()
  const createProject = useCreateProject()
  const { data: clientsData } = useGetClients()
  const { data: workersData } = useGetWorkers()
  const modalRef = useRef<HTMLIxModalElement>(null)
  const [form, setForm] = useState<ProjectCreate>({
    name: '',
    client_id: undefined,
    worker_id: undefined,
  })

  const handleChange = (field: keyof ProjectCreate) => (
    event: CustomEvent<{ value: string }> | any,
  ) => {
    const value = event.detail?.value ?? event.target.value
    setForm(prev => ({
      ...prev,
      [field]: field === 'client_id' || field === 'worker_id' ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createProject.mutate(
      { data: form },
      {
        onSuccess: () => {
          setForm({ name: '', client_id: undefined, worker_id: undefined })
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
            <IxSelect
              value={form.client_id?.toString() ?? ''}
              onValueChange={handleChange('client_id')}
            >
              {(clientsData?.data ?? []).map(c => (
                <IxSelectItem key={c.id} label={c.name} value={c.id.toString()} />
              ))}
            </IxSelect>
            <IxSelect
              value={form.worker_id?.toString() ?? ''}
              onValueChange={handleChange('worker_id')}
            >
              {(workersData?.data ?? []).map(w => (
                <IxSelectItem
                  key={w.id}
                  label={`${w.name} ${w.parental_surname}`}
                  value={w.id.toString()}
                />
              ))}
            </IxSelect>
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
              <td>{p.client_id}</td>
              <td>{p.worker_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

