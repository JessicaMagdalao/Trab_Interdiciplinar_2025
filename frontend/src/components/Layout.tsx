import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Heart, Filter, Search, Menu, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from '@/theme/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isActiveRoute = (path: string): boolean => {
    return path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  };

  const navigationItems = [
    { label: 'Início', path: '/', icon: Home },
    { label: 'Favoritos', path: '/favoritos', icon: Heart },
    { label: 'Gêneros', path: '/genero', icon: Filter }
  ];

  const renderNavItem = (item: (typeof navigationItems)[0], mobile = false) => {
    const Icon = item.icon;
    const isActive = isActiveRoute(item.path);
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          mobile ? 'w-full justify-start' : ''
        } ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
        onClick={() => mobile && setMobileMenuOpen(false)}
      >
        <Icon className="h-4 w-4" />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-xl hover:text-primary transition-colors"
            >
              <span>YumeGate Animes</span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navigationItems.map(item => renderNavItem(item))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Pesquisar
              </Button>
            </div>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  aria-label="Abrir menu de navegação"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-2 font-bold text-lg pb-4 border-b">
                    <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground text-sm font-bold">
                      A
                    </div>
                    <span>Yume Gate</span>
                  </div>
                  <nav className="flex flex-col gap-2">
                    {navigationItems.map(item => renderNavItem(item, true))}
                  </nav>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 justify-start w-full"
                  >
                    <Search className="h-4 w-4" />
                    Pesquisar Animes
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className="font-semibold">Yume Gate</h3>
              <p className="text-sm text-muted-foreground">
                Descubra, explore e favorite seus animes preferidos. Plataforma completa para fãs de anime.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold">Navegação</h3>
              <div className="flex flex-col gap-2">
                {navigationItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold">Recursos</h3>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span>Pesquisa Avançada</span>
                <span>Lista de Favoritos</span>
                <span>Filtros por Gênero</span>
                <span>Estatísticas Pessoais</span>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold">Informações</h3>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span>Dados da AniList API</span>
                <span>Atualizado Diariamente</span>
                <span>Interface Responsiva</span>
                <span>Código Aberto</span>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Yume Gate Animes. Desenvolvido para a comunidade anime.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Dados fornecidos pela AniList API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface BreadcrumbProps {
  items: Array<{ label: string; path?: string }>;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm text-muted-foreground mb-6"
    >
      <Link to="/" className="hover:text-foreground transition-colors">
        Início
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span>/</span>
          {item.path ? (
            <Link to={item.path} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
