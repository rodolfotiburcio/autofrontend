// src/components/UserList.tsx
import { useEffect, useState } from 'react'
import { getWorkers } from '../api/fastAPI'
import type { WorkerResponse } from '../api/fastAPI.schemas'

export function UserList() {
  const [usuarios, setUsuarios] = useState<WorkerResponse[]>([])

  useEffect(() => {
    getWorkers()
      .then(res => setUsuarios(res.data))
      .catch(console.error)
  }, [])

  return (
    <table className="ix-table ix-table-striped">
      <thead>
        <tr>
          <th>Apellid</th>
          <th>Nombre</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map(w => (
          <tr key={w.id}>
            <td>{w.parental_surname}</td>
            <td>{w.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}