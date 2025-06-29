import { useRef, useState } from 'react'
import {
  useGetWorkers,
  useCreateWorker,
} from '../api/fastAPI'
import type { WorkerCreate } from '../api/fastAPI.schemas'
import {
  IxCard,
  IxCardContent,
  IxTypography,
  IxLayoutAuto,
  IxInput,
  IxButton,
  IxModal,
  IxModalHeader,
  IxModalContent,
  IxModalFooter,
} from '@siemens/ix-react'

export function WorkerList() {
  const { data, refetch } = useGetWorkers()
  const createWorker = useCreateWorker()
  const modalRef = useRef<HTMLIxModalElement>(null)
  const [form, setForm] = useState<WorkerCreate>({
    name: '',
    parental_surname: '',
    maternal_surname: '',
  })

  const handleChange = (field: keyof WorkerCreate) => (
    event: CustomEvent<{ value: string }> | any,
  ) => {
    const value = event.detail?.value ?? event.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createWorker.mutate(
      { data: form },
      {
        onSuccess: () => {
          setForm({ name: '', parental_surname: '', maternal_surname: '' })
          modalRef.current?.closeModal()
          refetch()
        },
      },
    )
  }

  const workers = data?.data ?? []

  return (
    <>
      <IxButton onClick={() => modalRef.current?.showModal()} style={{ marginTop: '1rem' }}>
        Nuevo trabajador
      </IxButton>
      <IxModal ref={modalRef} closeOnBackdropClick closeOnEscape>
        <IxModalHeader>Crear trabajador</IxModalHeader>
        <IxModalContent>
          <form id="worker-form" onSubmit={handleSubmit}>
            <IxInput
              placeholder="Nombre"
              value={form.name}
              onInput={handleChange('name')}
            />
            <IxInput
              placeholder="Apellido paterno"
              value={form.parental_surname}
              onInput={handleChange('parental_surname')}
            />
            <IxInput
              placeholder="Apellido materno"
              value={form.maternal_surname}
              onInput={handleChange('maternal_surname')}
            />
          </form>
        </IxModalContent>
        <IxModalFooter>
          <IxButton onClick={() => modalRef.current?.dismissModal()}>Cancelar</IxButton>
          <IxButton type="submit" form="worker-form" style={{ marginLeft: '0.5rem' }}>
            Crear
          </IxButton>
        </IxModalFooter>
      </IxModal>
      <IxLayoutAuto
        layout={[
          { minWidth: '0', columns: 1 },
          { minWidth: '560px', columns: 3 },
          { minWidth: '800px', columns: 4 },
        ]}
      >
        {workers.map(w => (
          <IxCard key={w.id} variant="outline">
            <IxCardContent>
              <IxTypography bold>{w.name}</IxTypography>
              <IxTypography>{w.parental_surname} {w.maternal_surname}</IxTypography>
              <IxTypography text-color="alarm">ID: {w.id}</IxTypography>
            </IxCardContent>
          </IxCard>
        ))}
      </IxLayoutAuto>
    </>
  )
}
