'use client';

import { useAuthContext } from '@/contexts/Auth';
import { useModalUtils } from '@/hooks/useModalUtils';
import MenuIcon from '@mui/icons-material/Menu';
import { usePathname, useRouter } from 'next/navigation';
import { SideMenuModal } from '../@shared/SideMenuModal';
import { Text3 } from '../@shared/Texts';
import { ButtonSideMenu } from './components/ButtonSideMenu';

export function SideMenuHeader() {
  const { closeModal, openModal, showModal } = useModalUtils();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthContext();
  const { isAdmin } = user ?? {};

  const navigateToHome = () => {
    if (pathname === '/home') {
      // Forçar reload da home caso já esteja nela
      router.refresh();
    } else {
      router.push('/home');
    }
  };

  return (
    <div className="flex items-center justify-start text-text-semiLight">
      <SideMenuModal show={showModal} closeMenu={closeModal} closeOnBackDrop={true}>
        <div className="flex flex-col w-full h-full gap-4 py-6">
          <div className="flex w-full px-6">
            <Text3 className="flex items-center justify-center min-w-fit w-full whitespace-nowrap text-text-primary">
              RVT
            </Text3>
          </div>

          {/* Botão para Gerar Etiqueta (Home) */}
          <ButtonSideMenu
            text="Home"
            onClick={navigateToHome}
            isSelected={pathname === '/home'}
          />


          {/* Botão para Central de Usuários */}
          <ButtonSideMenu
            text="Usuários"
            onClick={() => router.push('/users')}
            isSelected={pathname === '/users'}
          />

          <ButtonSideMenu
            text="Clientes"
            onClick={() => router.push('/cliente/central')}
            isSelected={pathname === '/cliente/central'}
          />

          <ButtonSideMenu
            text="Obras"
            onClick={() => router.push('/obra/central')}
            isSelected={pathname === '/obra/central'}
          />

          {/* Botão para Logout */}
          <ButtonSideMenu text="Logout" onClick={logout} />
        </div>
      </SideMenuModal>

      {/* Botão de Abrir Menu */}
      <button type="button" className="relative flex items-center justify-center w-10 h-10 right-2">
        <MenuIcon fill="white" style={{ color: 'white' }} onClick={openModal} />
      </button>
    </div>
  );
}
