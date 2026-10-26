import type { Metadata } from "next";
import { ImagensManager } from "@/components/admin/ImagensManager";

export const metadata: Metadata = { title: "Imagens do Site" };

export default function Page() {
  return <ImagensManager />;
}
