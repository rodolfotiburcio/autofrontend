import {
  IxApplication,
  IxApplicationHeader,
  IxMenu,
  IxMenuItem,
  IxContent,
  IxContentHeader,
} from '@siemens/ix-react'
import { iconGlobe, iconHome, iconProduct, iconPlant, iconUser,  } from '@siemens/ix-icons/icons'
import '@siemens/ix/dist/siemens-ix/siemens-ix.css'

import { useState, useEffect } from 'react'
import { ProductList } from './components/ProductList'
import { ClientList } from './components/ClientList'
import { UserList } from './components/UserList'

export default () => {
  const [currentTab, setCurrentTab] = useState<'productos' | 'clientes' | 'usuarios'>('productos')

  return (
  <IxApplication>
    <IxApplicationHeader name="Inamex Automation">
      <img src="/LogoCompacto.svg" alt="Logo" slot="logo" height="32" />
    </IxApplicationHeader>

    <IxMenu>
      <IxMenuItem icon={iconProduct} onClick={()=>setCurrentTab('productos')}>Productos</IxMenuItem>
      <IxMenuItem icon={iconPlant} onClick={()=>setCurrentTab('clientes')}>Clientes</IxMenuItem>
      <IxMenuItem icon={iconUser} onClick={()=>setCurrentTab('usuarios')}>Usuarios</IxMenuItem>
    </IxMenu>

    <IxContent>
      <IxContentHeader 
        slot="header" 
        headerTitle={
          currentTab === 'productos' ? 'Lista de productos' :
          currentTab === 'clientes' ? 'Lista de clientes' :
          'Lista de usuarios'
        }
      />
      {currentTab === 'usuarios' && <UserList />}
      {currentTab === 'productos' && <ProductList />}
      {currentTab === 'clientes' && <ClientList />}
    </IxContent>
  </IxApplication>
  )
}
