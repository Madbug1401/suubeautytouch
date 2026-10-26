/** Texto com segmentos em itálico marcados com asteriscos: "Luz na medida *certa*." */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("*").map((seg, i) =>
        i % 2 ? (
          <em key={i} className="font-light">
            {seg}
          </em>
        ) : (
          seg
        ),
      )}
    </>
  );
}
