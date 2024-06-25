"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import CoupangCard from "@/app/product/components/card/CoupangCard";
import NaverCard from "@/app/product/components/card/NaverCard";
import { fetchShoppingList } from "@/app/product/utils/apis";
import { CoupangProduct, NaverProduct } from "@/app/product/utils/types";
import styles from "./Shopping.module.scss";

export default function Shopping({ name }: { name: string }) {
  const { data: naverData } = useSuspenseQuery<{ items: NaverProduct[] }>({
    queryKey: ["naver", name],
    queryFn: () => fetchShoppingList("naver", name) as Promise<{ items: NaverProduct[] }>,
  });

  const { data: coupangData } = useSuspenseQuery<{ items: CoupangProduct[] }>({
    queryKey: ["coupang", name],
    queryFn: () => fetchShoppingList("coupang", name) as Promise<{ items: CoupangProduct[] }>,
  });

  return (
    <section className={styles.container}>
      {coupangData?.items?.length > 0 && (
        <div className={styles.layout}>
          {coupangData?.items?.map((product) => (
            <CoupangCard
              key={product.link}
              product={product}
            />
          ))}
        </div>
      )}
      {naverData?.items?.length > 0 && (
        <div className={styles.layout}>
          {naverData?.items?.map((product) => (
            <NaverCard
              key={product.link}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}
