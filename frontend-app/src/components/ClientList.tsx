// src/components/ClientList.tsx
import React, { useEffect, useState } from 'react'
import { useGetClients, useCreateClient } from '../api/fastAPI'
import type { ClientCreate, ClientResponse } from '../api/fastAPI.schemas'
import  { IxInput, IxButton } from '@siemens/ix-react'

export function ClientList() {
  const { data, refetch } = useGetClients()
  const createClient = useCreateClient()
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
          refetch()
        },
      },
    )
  }

  const clients = data?.data ?? []

  return (
    <>
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem'}}>
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
      <IxButton type="submit" style={{ marginTop: '0.5rem'}}>
        Crear cliente
      </IxButton>
    </form>
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