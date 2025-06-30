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
  IxModalHeader,
  IxModalContent,
  IxModalFooter,
  Modal,
  type ModalRef,
  showModal,
} from '@siemens/ix-react'

export function WorkerList() {
  const { data, refetch } = useGetWorkers()
  const createWorker = useCreateWorker()
  const modalRef = useRef<ModalRef>(null)
  const [form, setForm] = useState<WorkerCreate>({
    name: '',
    parental_surname: '',
    maternal_surname: '',
  })

  const handleChange = (field: keyof WorkerCreate) => (
    event: CustomEvent<{ value: string }> | React.ChangeEvent<HTMLInputElement>,
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
          modalRef.current?.close(null)
          refetch()
        },
      },
    )
  }

  const openModal = () => {
    showModal({
      content: (
        <Modal ref={modalRef} >
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
            <IxButton onClick={() => modalRef.current?.dismiss(null)}>
              Cancelar
            </IxButton>
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
