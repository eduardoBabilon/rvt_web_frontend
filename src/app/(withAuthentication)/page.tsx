import { Title } from '@/components/Title';
import ListagensCentral from './homelayout';

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full p-8 flex-1">
       <div className="flex flex-col w-full gap-4 bg-white">
            <div className="grid grid-cols-4 gap-4">
              <div className="flex col-span-2 md:col-span-3">
                <Title />
              </div>
            </div>
      
            {/* Adicionando o EtiquetaForm aqui */}
            <ListagensCentral />
      
            {/* O restante do conteúdo do HomeDashboard continua aqui */}
            {/* Você pode adicionar outros componentes ou lógica conforme necessário */}
          </div>
    </div>
  );
}
