import { useLayoutEffect, useRef, useState, type ChangeEvent } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import {
  useGetWorkers,
  useCreateWorker,
  uploadWorkerPhoto,
} from '../api/fastAPI'
import type { WorkerCreate } from '../api/fastAPI.schemas'
import {
  IxCard,
  IxCardContent,
  IxTypography,
  IxLayoutAuto,
  IxInput,
  IxButton,
  Modal,
  type ModalRef,
  showModal,
  IxModalHeader,
  IxModalContent,
  IxModalFooter,
  IxWorkflowStep,
  IxWorkflowSteps,
  IxLayoutGrid,
  IxRow,
} from '@siemens/ix-react'

export function WorkerList() {
  const { data, refetch } = useGetWorkers()
  const createWorker = useCreateWorker()
  const modalRef = useRef<ModalRef>(null)
  const [photo, setPhoto] = useState<File | null>(null)

  const validationSchema = yup.object({
    name: yup.string().required('El nombre es requerido'),
    parental_surname: yup
      .string()
      .required('El apellido paterno es requerido'),
    maternal_surname: yup
      .string()
      .required('El apellido materno es requerido'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm<WorkerCreate>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: { name: '', parental_surname: '', maternal_surname: '', photo_url: undefined },
    resolver: yupResolver(validationSchema),
  })

  useLayoutEffect(() => {
    trigger()
  }, [trigger])

  const onSubmit = (data: WorkerCreate) => {
    console.log("Creando trabajador")
    createWorker.mutate(
      { data },
      {
        onSuccess: async res => {
          if (photo) {
            console.log("Subiendo Foto")
            await uploadWorkerPhoto(res.data.id, photo)
            console.log("Foto subida")
          }
          setPhoto(null)
          modalRef.current?.close(null)
          refetch()
        },
      },
    )
  }

  const handleChange = (field: keyof WorkerCreate) => (
    event: CustomEvent<{ value: string }> | React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.detail?.value ?? event.target.value
    setValue(field, value, { shouldValidate: true })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoto(e.target.files?.[0] ?? null)
  }

  const openModal = () => {
    showModal({
      size: '600',
      content: (
        <Modal ref={modalRef}>
          <IxModalHeader>Crear trabajador</IxModalHeader>
          <IxModalContent>
            <form id="worker-form" onSubmit={handleSubmit(onSubmit)}>
              <IxLayoutAuto>
                <IxInput
                  label="Nombre"
                  {...register('name')}
                  onInput={handleChange('name')}
                  className={clsx({ 'ix-invalid': errors.name })}
                  invalidText={errors.name?.message}
                />
                <IxInput
                  label="Apellido paterno"
                  {...register('parental_surname')}
                  onInput={handleChange('parental_surname')}
                  className={clsx({ 'ix-invalid': errors.parental_surname })}
                  invalidText={errors.parental_surname?.message}
                />
                <IxInput
                  label="Apellido materno"
                  {...register('maternal_surname')}
                  onInput={handleChange('maternal_surname')}
                  className={clsx({ 'ix-invalid': errors.maternal_surname })}
                  invalidText={errors.maternal_surname?.message}
                />
                <input type="file" onChange={handleFileChange} />
              </IxLayoutAuto>
            </form>
          </IxModalContent>
          <IxModalFooter>
            <IxButton onClick={() => modalRef.current?.close(null)}>Cerrar</IxButton>
            <IxButton type="submit" form="worker-form" style={{ marginLeft: '0.5rem' }}>
              Crear
            </IxButton>
          </IxModalFooter>
        </Modal>
      ),
    })
  }

  const workers = data?.data ?? []

  return (
    <>
      <IxButton onClick={openModal} style={{ marginTop: '1rem' }}>
        Nuevo trabajador
      </IxButton>

      <IxLayoutAuto
        layout={[
          { minWidth: '0', columns: 2 },
          { minWidth: '600px', columns: 3 },
          { minWidth: '900px', columns: 5 },
          { minWidth: '1400px', columns: 8 },
        ]}
      >
        {workers.map(w => (
          <IxCard key={w.id} variant="outline">
            <IxLayoutGrid>
              <IxRow>
                <IxCardContent>
                  {w.photo_url && (
                    <img src={w.photo_url} style={{ width: 'auto', height: '100px' }} />
                  )}
                  <IxTypography bold>{w.name}</IxTypography>
                  <IxTypography>{w.parental_surname} {w.maternal_surname}</IxTypography>
                  <IxTypography text-color="alarm">ID: {w.id}</IxTypography>
                </IxCardContent>
              </IxRow>
              <IxRow>
              <IxWorkflowSteps>
                  <IxWorkflowStep status="done"></IxWorkflowStep>
                  <IxWorkflowStep status="done"></IxWorkflowStep>
                  <IxWorkflowStep status="done"></IxWorkflowStep>
                  <IxWorkflowStep status="success"></IxWorkflowStep>
                </IxWorkflowSteps>
              </IxRow>
            </IxLayoutGrid>

          </IxCard>
        ))}
      
      </IxLayoutAuto>
    </>
  )
}
