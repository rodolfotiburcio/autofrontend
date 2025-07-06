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
  useGetStatus,
  useGetStatuses,
} from '../api/fastAPI'
import type { ProjectCreate } from '../api/fastAPI.schemas'
import { ProjectType } from '../api/fastAPI.schemas'
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
  const { data: statusesData } = useGetStatuses()
  const modalRef = useRef<ModalRef>(null)

  const validationSchema = yup.object({
    name: yup.string().required('El nombre es requerido'),
    client_id: yup
      .number()
      .nonNullable(),
    worker_id: yup
      .number()
      .nonNullable(),
    status_id: yup
      .number()
      .nonNullable(),
    purchase_order: yup
      .string()
      .nonNullable(),
    folio: yup
      .string()
      .nonNullable(),
    type: yup
      .string()
      .nonNullable(),
    start_date: yup
      .string()
      .nonNullable(),
    end_date: yup
      .string()
      .nonNullable(),
    directory_path: yup
      .string()
      .nonNullable(),
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
      status_id: undefined,
      purchase_order: '',
      folio: '',
      type: undefined,
      start_date: '',
      end_date: '',
      directory_path: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const handleSelectChange =
    (field: 'client_id' | 'worker_id' | 'status_id' | 'type',) =>
    (event: CustomEvent<string | string[]>) => {
      const value = Array.isArray(event.detail) ? event.detail[0] : event.detail
      if (field ==='client_id' || field === 'worker_id' || field === 'status_id'){
        setValue(field, Number(value), { shouldValidate: true })
      } else {
        setValue(field, value as any, {shouldValidate: true})
      }
    }

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
          setValue('worker_id', undefined)
          setValue('status_id', undefined)
          setValue('purchase_order', '')
          setValue('folio', '')
          setValue('type', undefined)
          setValue('start_date', '')
          setValue('end_date', '')
          setValue('directory_path', '')
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
                  {...register('client_id', { required: true })}
                  onValueChange={handleSelectChange('client_id')}
                >
                  {(clientsData?.data ?? []).map(c => (
                    <IxSelectItem key={c.id} label={c.name} value={c.id.toString()} />
                  ))}
                </IxSelect>
                <IxSelect
                  label="Responsable"
                  value={(watch('worker_id') ?? '').toString()}
                  {...register('worker_id', { required: true })}
                  onValueChange={handleSelectChange('worker_id')}
                >
                  {(workersData?.data ?? []).map(w => (
                    <IxSelectItem
                      key={w.id}
                      label={`${w.name} ${w.parental_surname}`}
                      value={w.id.toString()}
                    />
                  ))}
                </IxSelect>
                <IxSelect
                  label="Estatus"
                  value={(watch('status_id') ?? '').toString()}
                  {...register('status_id')}
                  onValueChange={handleSelectChange('status_id')}
                >
                  {(statusesData?.data ?? []).map(s => (
                    <IxSelectItem key={s.id} label={s.name} value={s.id.toString()} />
                  ))}
                </IxSelect>
                <IxInput label="Orden de compra" {...register('purchase_order')} />
                <IxInput label="Folio" {...register('folio')} />
                <IxSelect
                  label="Tipo"
                  value={(watch('type') ?? '').toString()}
                  {...register('type')}
                  onValueChange={handleSelectChange('type')}
                >
                  {Object.entries(ProjectType).map(([key, value]) => (
                    <IxSelectItem key={key} label={value} value={value} />
                  ))}
                </IxSelect>
                <IxInput
                  label="Fecha inicio"
                  type="date"
                  {...register('start_date')}
                />
                <IxInput
                  label="Fecha fin"
                  type="date"
                  {...register('end_date')}
                />
                <IxInput label="Directorio" {...register('directory_path')} />
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
  const clients = clientsData?.data ?? []
  const workers = workersData?.data ?? []
  const statuses = statusesData?.data ?? []

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
        valueGetter: params =>
          clients.find(c => c.id === params.data.client_id)?.name ?? '',
      },
      {
        field: 'worker_id',
        headerName: 'Responsable',
        resizable: true,
        sortable: true,
        filter: true,
        valueGetter: params => {
          const worker = workers.find(w => w.id === params.data.worker_id)
          return worker ? `${worker.name} ${worker.parental_surname}` : ''
        },
      },
      {
        field: 'status_id',
        headerName: 'Estado',
        resizable: true,
        sortable: true,
        filter: true,
        valueGetter: params => {
          const status = statuses.find(s => s.id === params.data.status_id)
          return status ? `${status.name}` : ''
        },
      },
      {
        field: 'purchase_order',
        headerName: 'OC',
        resizable: true,
        sortable: true,
        filter: true,
      },
      {
        field: 'folio',
        headerName: 'Folio',
        resizable: true,
        sortable: true,
        filter:true,
      },
      {
        field: 'type',
        headerName: 'Tipo',
        resizable: true,
        sortable: true,
        filter: true,
      },
      {
        field: 'start_date',
        headerName: 'Inicio',
        resizable: true,
        sortable: true,
        filter: true,
      },
      {
        field: 'end_date',
        headerName: 'Fin',
        resizable: true,
        sortable: true,
        filter: true,
      },
      {
        field: 'directory_path',
        headerName: 'Carpeta',
        resizable: true,
        sortable: true,
        filter: true,
      }
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