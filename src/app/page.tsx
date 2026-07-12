import { redirect } from "next/navigation";

// TODO(JOS-60/61): una vez exista login, esta ruta pasa a ser la pantalla de
// acceso (P8) y el redirect a /inicio se mueve a después de autenticar.
export default function Home() {
  redirect("/inicio");
}
