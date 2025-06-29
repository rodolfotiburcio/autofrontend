import {
  IxApplication,
  IxApplicationHeader,
  IxMenu,
  IxMenuItem,
  IxContent,
  IxContentHeader,
} from '@siemens/ix-react'
import { iconUser, iconBuilding1 } from '@siemens/ix-icons/icons'
import '@siemens/ix/dist/siemens-ix/siemens-ix.css'

import { WorkerList } from './components/WorkerList'
import { ClientList } from './components/ClientList'

import {useState, useEffect} from 'react'

export default () => {
  const [currentTab, setCurrentTab] = useState<'workers'|'clients'>('workers')
  return (
    <IxApplication>
      <IxApplicationHeader name="Inamex Automation">
        <img src="/LogoCompacto.svg" alt="Logo" slot="logo" height="32" />
      </IxApplicationHeader>
      <IxMenu>
        <IxMenuItem
          icon={iconUser}
          onClick={()=>setCurrentTab('workers')}
        >Trabajadores</IxMenuItem>
        <IxMenuItem
          icon={iconBuilding1}
          onClick={()=>setCurrentTab('clients')}
        >Clientes</IxMenuItem>
      </IxMenu>
      <IxContent>
        <IxContentHeader
          slot="header"
          headerTitle={
            currentTab === 'clients' ? 'Lista de clientes' : 'Lista de trabajadores'
          }
        />
        {currentTab === 'clients' && <ClientList />}
        {currentTab === 'workers' && <WorkerList />}
      </IxContent>
    </IxApplication>
  )
}
