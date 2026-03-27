export function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-surface px-4 py-4 lg:px-8">
      <p className="text-center text-xs text-text-muted">
        &copy; {new Date().getFullYear()} HuB - Atlântico. As notícias são
        propriedade de suas respectivas fontes.
      </p>
    </footer>
  );
}
