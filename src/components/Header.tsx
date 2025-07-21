
import React from 'react';
import { Link } from 'react-router-dom';
import { getConversionColor } from '@/utils/conversionColors';
import PDFChoiceLogo from '@/components/PDFChoiceLogo';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface HeaderProps {
  activeConversion?: string;
}

const Header: React.FC<HeaderProps> = ({ activeConversion = 'png-jpg' }) => {
  return (
    <header className="w-full py-5 px-6 flex justify-between items-center" style={{ backgroundColor: '#DBEAFE' }}>
      <Link to="/" onClick={() => window.location.href = '/'}>
        <PDFChoiceLogo />
      </Link>
      
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-gray-800 font-medium">
              Blog
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[600px] p-4">
                <div className="grid gap-3">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/blog/converter-png-para-pdf"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">📄 Como converter PNG para PDF online</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Converta PNG em PDF de forma rápida e segura sem instalar nada
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  
                  <NavigationMenuLink asChild>
                    <Link
                      to="/blog/diferenca-jpg-png-pdf"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">📄 Diferença entre JPG, PNG e PDF</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Entenda qual formato usar em cada situação
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  
                  <NavigationMenuLink asChild>
                    <Link
                      to="/blog/reduzir-tamanho-pdf"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">📄 Como reduzir tamanho de PDF</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Comprima PDFs sem perder qualidade
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  
                  <NavigationMenuLink asChild>
                    <Link
                      to="/blog/proteger-pdf-senha"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">📄 Como proteger PDF com senha</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Guia completo para proteger documentos confidenciais
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  
                  <NavigationMenuLink asChild>
                    <Link
                      to="/blog/erros-enviar-arquivos-email"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">📄 5 erros ao enviar arquivos por e-mail</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Como evitar problemas comuns no envio de documentos
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default Header;
