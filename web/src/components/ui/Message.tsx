export type Msg = { tipo: "success" | "error" | "info"; texto: string } | null;

export function Message({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return <p role="status" className={`msg msg-${msg.tipo}`}>{msg.texto}</p>;
}
