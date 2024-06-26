import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import ProductCard from "@/app/product/components/card/ProductCard";
import ReviewCardList from "@/app/product/components/card/ReviewCardList";
import Shopping from "@/app/product/components/shopping/Shopping";
import ReviewListSkeleton from "@/app/product/components/skeleton/ReviewListSkeleton";
import ShoppingSkeleton from "@/app/product/components/skeleton/ShoppingSkeleton";
import Statistics, { StatisticsProps } from "@/components/Card/Statistics/Statistics";
import authOptions from "@/lib/auth";
import { ProductDetailType } from "@/types/global";
import HttpClient from "@/utils/httpClient";
import { getMetadata } from "@/utils/metadata";
import styles from "./page.module.scss";

type StatisticsListType = Omit<StatisticsProps, "compare">;

type ParamsType = {
  params: { slug: string };
};

export const generateMetadata = async ({ params: { slug } }: ParamsType): Promise<Metadata> => {
  const httpClient = new HttpClient(process.env.BASE_URL || "");
  const headers: HeadersInit = { cache: "no-cache" };

  const productDetail: ProductDetailType = await httpClient.get(`/products/${slug}`, {
    headers,
    cache: "no-cache",
  });

  return getMetadata({
    title: productDetail.name,
    description: `${productDetail.description} | mogazoa에서 ${productDetail.name}의 사용자 후기를 확인해보세요.`,
  });
};

export default async function ProductPage({ params }: ParamsType) {
  const session = await getServerSession(authOptions);

  const accessToken = session?.accessToken;
  const productId = params.slug;
  const httpClient = new HttpClient(process.env.BASE_URL || "");
  const headers: HeadersInit = { cache: "no-cache" };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const productDetail: ProductDetailType = await httpClient.get(`/products/${productId}`, {
    headers,
    cache: "no-cache",
  });

  const { rating, reviewCount, favoriteCount, categoryMetric } = productDetail;
  const statisticsList: StatisticsListType[] = [
    { title: "별점 평균", rating },
    { title: "리뷰", reviewCount },
    { title: "찜", favoriteCount },
  ];

  return (
    <div className={styles.layout}>
      <ProductCard
        productDetail={productDetail}
        session={session}
      />
      <h2 className={styles.title}>상품 통계</h2>
      <div className={styles.metricBox}>
        {statisticsList.map((statistics) => (
          <Statistics
            className={styles.statistics}
            key={statistics.title}
            title={statistics.title}
            rating={statistics.rating}
            reviewCount={statistics.reviewCount}
            favoriteCount={statistics.favoriteCount}
            compare={categoryMetric}
          />
        ))}
      </div>
      <Suspense fallback={<ReviewListSkeleton reviewCount={reviewCount} />}>
        <ReviewCardList
          session={session}
          productId={productId}
          reviewCount={reviewCount}
        />
      </Suspense>
      <h2 className={styles.title}>쇼핑하러가기</h2>
      <Suspense fallback={<ShoppingSkeleton />}>
        <Shopping name={productDetail.name} />
      </Suspense>
    </div>
  );
}
