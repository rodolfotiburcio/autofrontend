import {
  IxApplication,
  IxApplicationHeader,
  IxMenu,
  IxMenuItem,
  IxContent,
  IxContentHeader,
} from '@siemens/ix-react'
import { iconUser, iconBuilding1, iconProject } from '@siemens/ix-icons/icons'
import '@siemens/ix/dist/siemens-ix/siemens-ix.css'

import { WorkerList } from './components/WorkerList'
import { ClientList } from './components/ClientList'
import { ProjectList } from './components/ProjectList'

import {useState, useEffect} from 'react'

export default () => {
  const [currentTab, setCurrentTab] = useState<'workers'|'clients'|'projects'>('workers')
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
        <IxMenuItem
          icon={iconProject}
          onClick={()=>setCurrentTab('projects')}
        >Proyectos</IxMenuItem>
      </IxMenu>
      <IxContent>
        <IxContentHeader
          slot="header"
          headerTitle={
            currentTab === 'clients' ? 'Lista de clientes' : currentTab === 'projects' ? 'Lista de proyectos' : 'Lista de trabajadores'
          }
        />
        {currentTab === 'clients' && <ClientList />}
        {currentTab === 'workers' && <WorkerList />}
        {currentTab === 'projects' && <ProjectList />}
      </IxContent>
    </IxApplication>
  )
}
