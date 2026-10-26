// Aplica o tema guardado antes da pintura (evita o "flash").
const code = `try{if(localStorage.getItem("theme-preference")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
