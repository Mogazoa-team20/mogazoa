import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import cn from "@/utils/classNames";
import styles from "./UserProductList.module.scss";
import type { ProductType } from "@/types/global";

type ProductListProps = {
  list: ProductType[];
  lastRef: () => void;
};

export default function UserProductList({ list, lastRef }: ProductListProps) {
  return (
    <div className={cn(styles.container)}>
      {list.map((item, idx) => (
        <Link
          href={`/product/${item.id}`}
          key={item.id}
        >
          <ProductCard product={item} />
          <div ref={idx === list.length - 1 ? lastRef : null} />
        </Link>
      ))}
    </div>
  );
}
