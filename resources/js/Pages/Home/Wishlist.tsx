import AuthenticatedUser from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import HeaderWishlist from "./Partials/HeaderWishlist";
import { useCallback, useEffect, useState } from "react";
import { FetchSuccess } from "@/types";
import WishlistCard, { IntrinsicTypeData } from "@/Components/LoopPartial/WishlistArmadaLoop";
import EmptyState from "@/Components/EmptyState";
import { FaArrowLeft } from "react-icons/fa";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<IntrinsicTypeData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(route("v1.home.wishlist.index"));
      const data: FetchSuccess<IntrinsicTypeData[] | null> = await response.json();
      setWishlist(data.data);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <AuthenticatedUser header={<HeaderWishlist />}>
      <Head title="Daftar Armada Favorit" />

      <div className="gap-3 py-5 d-flex flex-column">
        <div style={{ width: 'fit-content' }}>
          <Link
            href={route('armada.index')}
            className="gap-2 btn btn-light d-flex align-items-center"
          >
            <FaArrowLeft />
            Ke Daftar Armada
          </Link>
        </div>

        {loading && <p>Loading...</p>}
        {!loading && error && (
          <EmptyState
            errorCode="404"
            title="Terjadi Kesalahan"
            message="Tidak dapat memuat data, silakan coba lagi nanti."
          />
        )}
        {!loading && !error && wishlist && wishlist.length > 0 && (
          <ul className="gap-3 list-unstyled d-flex flex-column">
            {wishlist.map(car => (
              <li key={car.id}>
                <WishlistCard onDelete={fetchWishlist} {...car} />
              </li>
            ))}
          </ul>
        )}
        {!loading && !error && (!wishlist || wishlist.length === 0) && (
          <EmptyState
            errorCode="404"
            title="Daftar Armada Favorit Kosong"
            message="Belum ada mobil favorit buat sekarang nih"
            link={{
              label: "Cari Mobil Favorit",
              href: route("armada.index"),
            }}
          />
        )}
      </div>
    </AuthenticatedUser>
  );
}

