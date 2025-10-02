import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Link href="/" className="text-primary-foreground font-bold text-lg">C</Link>
              </div>
              <span className="font-bold text-xl text-foreground">CarInfo</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Sua fonte confiável de informações sobre carros. Explore modelos, especificações e características
              técnicas de forma simples e organizada.
            </p>
            <div className="inline-flex items-center space-x-2 bg-accent/10 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-xs text-accent font-medium">Site apenas informativo</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Institucional</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="/about-us" className="hover:text-accent transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="/usage" className="hover:text-accent transition-colors">
                  Como Funciona?
                </a>
              </li>
              <li>
                <div>
                  Contato
                  <a target="_blank" href="https://wa.me/5585997630265" className="p-2 bg-green-500 size-8 cursor-pointer rounded-full flex items-center justify-center text-zinc-50 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"/></svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="/privacy-policy" className="hover:text-accent transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="/terms-of-usage" className="hover:text-accent transition-colors">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 CarInfo. Todos os direitos reservados. Site desenvolvido para fins informativos.</p>
        </div>
      </div>
    </footer>
  )
}
