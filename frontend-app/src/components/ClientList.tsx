// src/components/ClientList.tsx
import React, { useEffect, useState, useRef } from 'react'
import { useGetClients, useCreateClient } from '../api/fastAPI'
import type { ClientCreate, ClientResponse } from '../api/fastAPI.schemas'
import  {
  IxInput,
  IxButton,
  IxModalHeader,
  IxModalContent,
  IxModalFooter,
  Modal,
  ModalRef,
  showModal,
} from '@siemens/ix-react'

export function ClientList() {
  const { data, refetch } = useGetClients()
  const createClient = useCreateClient()
  const modalRef = useRef<ModalRef>(null)
  const [form, setForm] = useState<ClientCreate>({
    name: '',
    score: 10,
  })

  const handleChange = (field: keyof ClientCreate) => (
    event: CustomEvent<{ value: string }> | any,
  ) => {
    const value = event.detail?.value ?? event.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createClient.mutate(
      { data: form },
      {
        onSuccess: () => {
          setForm({ name: '', score: 10})
          modalRef.current?.close(null)
          refetch()
        },
      },
    )
  }

  const openModal = () => {
    showModal({
      content: (
        <Modal ref={modalRef} closeOnBackdropClick closeOnEscape>
          <IxModalHeader>Crear cliente</IxModalHeader>
          <IxModalContent>
            <form id="client-form" onSubmit={handleSubmit}>
              <IxInput
                placeholder="Nombre"
                value={form.name}
                onInput={handleChange('name')}
              />
              <IxInput
                placeholder="Calificacion"
                value={form.score.toFixed(0)}
                onInput={handleChange('score')}
              />
            </form>
          </IxModalContent>
          <IxModalFooter>
            <IxButton onClick={() => modalRef.current?.dismiss(null)}>
              Cancelar
            </IxButton>
            <IxButton type="submit" form="client-form" style={{ marginLeft: '0.5rem' }}>
              Crear
            </IxButton>
          </IxModalFooter>
        </Modal>
      ),
    })
  }

  const clients = data?.data ?? []

  return (
    <>
      <IxButton onClick={openModal} style={{ marginTop: '1rem'}}>
        Nuevo cliente
      </IxButton>
      
      <table className="ix-table ix-table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Calificacion</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(w => (
            <tr key={w.id}>
              <td>{w.id}</td>
              <td>{w.name}</td>
              <td>{w.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
