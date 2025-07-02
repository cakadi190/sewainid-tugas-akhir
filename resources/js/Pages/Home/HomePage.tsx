import ArmadaCategorySection from "@/Components/GlobalPartial/ArmadaCategory";
import ArmadaListSection from "@/Components/GlobalPartial/ArmadaList";
import AuthenticatedUser from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import HeaderHome from "./Partials/Header";

export default function HomePage() {
  return (
    <AuthenticatedUser header={<HeaderHome />}>
      <Head title="Beranda" />

      <div className="pt-5">
        <ArmadaListSection />
        <ArmadaCategorySection />
      </div>
    </AuthenticatedUser>
  );
}
