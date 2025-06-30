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
  IxModalHeader,
  IxModalContent,
  IxModalFooter,
  Modal,
  type ModalRef,
  showModal,
} from '@siemens/ix-react'
import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import '@siemens/ix-aggrid/dist/ix-aggrid/ix-aggrid.css'

export function ProjectList() {
  const { data, refetch } = useGetProjects()
  const createProject = useCreateProject()
  const { data: clientsData } = useGetClients()
  const { data: workersData } = useGetWorkers()
  const modalRef = useRef<ModalRef>(null)
  const [form, setForm] = useState<ProjectCreate>({
    name: '',
    client_id: undefined,
    worker_id: undefined,
  })

  const handleChange = (field: keyof ProjectCreate) => (
    event: CustomEvent<{ value: string }> | React.ChangeEvent<HTMLInputElement>,
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
          modalRef.current?.close({})
          refetch()
        },
      },
    )
  }

  const openModal = () => {
    showModal({
      content: (
        <Modal ref={modalRef} >
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
            <IxButton onClick={() => modalRef.current?.dismiss({})}>Cancelar</IxButton>
            <IxButton type="submit" form="project-form" style={{ marginLeft: '0.5rem' }}>
              Crear
            </IxButton>
          </IxModalFooter>
        </Modal>
      ),
    })
  }

  const projects = data?.data ?? []

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        resizable: true,
      },
      {
        field: 'name',
        headerName: 'Nombre',
        resizable: true,
        sortable: true,
        filter: true,
      },
      {
        field: 'client_id',
        headerName: 'Cliente',
        resizable: true,
        sortable: true,
        filter: true,
      },
      {
        field: 'worker_id',
        headerName: 'Responsable',
        resizable: true,
        sortable: true,
        filter: true,
      },
    ],
    [],
  )

  return (
    <>
      <IxButton
        onClick={openModal}
        style={{ marginTop: '1rem' }}>
        Nuevo proyecto
      </IxButton>

      <div style={{ width: '100%', height: '400px', marginTop: '1rem' }}>
        <AgGridReact
          rowData={projects}
          columnDefs={columnDefs}
          rowSelection="multiple"
          suppressCellFocus
          className="ag-theme-alpine-dark ag-theme-ix"
        ></AgGridReact>
      </div>
    </>
  )
}