// Corre antes da pintura: aplica o tema guardado (evita o "flash"), marca que há JS
// (o hero esconde o texto até animar) e se a abertura já foi vista nesta sessão.
const code = `(function(){var d=document.documentElement;d.classList.add("js");try{if(localStorage.getItem("theme-preference")==="dark")d.setAttribute("data-theme","dark");if(sessionStorage.getItem("sbt-intro"))d.classList.add("intro-seen")}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
