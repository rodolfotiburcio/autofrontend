// src/components/ClientList.tsx
import { useEffect, useState } from 'react'
import { getWorkers } from '../api/fastAPI'
import type { WorkerResponse } from '../api/fastAPI.schemas'

export function ClientList() {
  const [clientes, setClientes] = useState<WorkerResponse[]>([])

  useEffect(() => {
    getWorkers()
      .then(res => setClientes(res.data))
      .catch(console.error)
  }, [])

  return (
    <table className="ix-table ix-table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map(w => (
          <tr key={w.id}>
            <td>{w.id}</td>
            <td>{w.name}</td>
            <td>{w.parental_surname}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}