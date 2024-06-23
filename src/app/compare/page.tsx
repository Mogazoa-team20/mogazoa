"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Product } from "@/app/compare/input/compareProductItem";
import { LOADING_LARGE_IMAGE } from "@/utils/constant";
import styles from "./compare.module.scss";
import ProductSelector from "./input/CompareInput";
import { getFromLocalStorage, saveToLocalStorage } from "./input/localStorage";
import CompareTable from "./table/CompareTable";

function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState<{
    product1: Product | null;
    product2: Product | null;
  }>({ product1: null, product2: null });

  useEffect(() => {
    const savedProduct1 = getFromLocalStorage("selectedProduct1");
    const savedProduct2 = getFromLocalStorage("selectedProduct2");
    setSelectedProducts({ product1: savedProduct1, product2: savedProduct2 });
  }, []);

  const handleCompare = (product1: Product | null, product2: Product | null) => {
    setSelectedProducts({ product1, product2 });
    saveToLocalStorage("selectedProduct1", product1);
    saveToLocalStorage("selectedProduct2", product2);
  };

  return (
    <div className={styles.background}>
      <ProductSelector onCompare={handleCompare} />
      {selectedProducts.product1 && selectedProducts.product2 ? (
        <CompareTable
          product1={selectedProducts.product1}
          product2={selectedProducts.product2}
        />
      ) : (
        <div className={styles.loading}>
          <Image
            src={LOADING_LARGE_IMAGE}
            alt='loading'
            width={87}
            height={84}
          />
        </div>
      )}
    </div>
  );
}

export default ComparePage;
