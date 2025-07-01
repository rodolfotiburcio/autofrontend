import React, { useLayoutEffect, useRef } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
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
  Modal,
  type ModalRef,
  showModal,
  IxModalHeader,
  IxModalContent,
  IxModalFooter,
  IxLayoutAuto,
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

  const validationSchema = yup.object({
    name: yup.string().required('El nombre es requerido'),
    client_id: yup
      .number()
      .nonNullable(),
    worker_id: yup
      .number()
      .nonNullable()
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useForm({
    mode: 'all',
    reValidateMode: 'onSubmit',
    defaultValues: { 
      name: '',
      client_id: undefined,
      worker_id: undefined,
    },
    resolver: yupResolver(validationSchema),
  });

  useLayoutEffect(() => {
    trigger()
  }, [trigger]);

  const onSubmit = (data: ProjectCreate) => {
    console.log(data);
    createProject.mutate(
      { data },
      {
        onSuccess: () => {
          modalRef.current?.close(null)
          setValue('name','')
          setValue('client_id', undefined)
          refetch()
        }
      }
    )
  };

  const openModal = () => {
    showModal({
      size: '600',
      content: (
        <Modal ref={modalRef}>
          <IxModalHeader>Crear proyecto</IxModalHeader>
          <IxModalContent>
            <form id="project-form" onSubmit={handleSubmit(onSubmit)}>
              <IxLayoutAuto>
                <IxInput
                  label="Nombre"
                  {...register('name')}
                  className={clsx({ 'ix-invalid': errors.name })}
                  invalidText={errors.name?.message}
                />
                <IxSelect
                  label="Cliente"
                  value={(watch('client_id') ?? '').toString()}
                  {...register('client_id',{ required: true })}
                >
                  {(clientsData?.data ?? []).map(c => (
                    <IxSelectItem key={c.id} label={c.name} value={c.id.toString()} />
                  ))}
                </IxSelect>
                <IxSelect
                  label="Responsable"
                  value={(watch('worker_id') ?? '').toString()}
                  {...register('worker_id',{ required: true })}
                >
                  {(workersData?.data ?? []).map(w => (
                    <IxSelectItem
                      key={w.id}
                      label={`${w.name} ${w.parental_surname}`}
                      value={w.id.toString()}
                    />
                  ))}
                </IxSelect>
              </IxLayoutAuto>
            </form>
          </IxModalContent>
          <IxModalFooter>
            <IxButton onClick={() => modalRef.current?.close(null)}>Cerrar</IxButton>
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


      <div style={{ width: '100%', height: '90%', marginTop: '1rem' }}>
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