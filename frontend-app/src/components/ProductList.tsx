// src/components/ProductList.tsx
import { useEffect, useState } from 'react'
import type { WorkerResponse } from '../api/fastAPI.schemas'
import { getWorkers } from '../api/fastAPI'

import { IxCard, IxCardContent, IxTypography } from '@siemens/ix-react';
import { IxLayoutAuto } from '@siemens/ix-react';

export function ProductList() {
  const [productos, setProductos] = useState<WorkerResponse[]>([])

  useEffect(() => {
    getWorkers()
      .then(res => setProductos(res.data))
      .catch(console.error)
  }, [])

  return (
    <>
      <IxLayoutAuto
        className="LayoutExample"
        layout={[
          { minWidth: '0', columns: 1 },
          { minWidth: '560px', columns: 3 },
          { minWidth: '800px', columns: 6 },
        ]}
      >
        {productos.map(w => (
              <IxCard variant="outline" onClick={console.log}>
              <IxCardContent>
                <IxTypography bold>{w.name}</IxTypography>
                <IxTypography>
                  id: {w.id.toString()} | cliente: {w.parental_surname}
                </IxTypography>
              </IxCardContent>
            </IxCard>
        ))}
      </IxLayoutAuto>
  </>
  )
}