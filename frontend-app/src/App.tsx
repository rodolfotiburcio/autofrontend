import {
  IxApplication,
  IxApplicationHeader,
  IxContent,
  IxContentHeader,
} from '@siemens/ix-react'
import '@siemens/ix/dist/siemens-ix/siemens-ix.css'

import { WorkerList } from './components/WorkerList'

export default () => {
  return (
    <IxApplication>
      <IxApplicationHeader name="Inamex Automation">
        <img src="/LogoCompacto.svg" alt="Logo" slot="logo" height="32" />
      </IxApplicationHeader>
      <IxContent>
        <IxContentHeader slot="header" headerTitle="Lista de trabajadores" />
        <WorkerList />
      </IxContent>
    </IxApplication>
  )
}
