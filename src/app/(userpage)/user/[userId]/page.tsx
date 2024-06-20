"use client";

/* eslint-disable no-restricted-imports */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";
import Activity from "@/components/Card/Activity/Activity";
import cn from "@/utils/classNames";
import HttpClient from "@/utils/httpClient";
import UserActivityList from "./components/UserActivityList/UserActivityList";
import UserInfo from "./components/UserInfo/UserInfo";
import styles from "./UserPage.module.scss";
import { UserDetail } from "../../types";

export default function UserPage({ params }: { params: { userId: number } }) {
  const { data: session } = useSession();
  const ACCESS_TOKEN = session?.accessToken;

  const httpClient = new HttpClient(process.env.NEXT_PUBLIC_BASE_URL!);

  const { data } = useQuery({
    queryKey: ["userData", params.userId],
    queryFn: async () => {
      const res = httpClient.get<UserDetail>(`users/${params.userId}`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        cache: "no-cache",
      });
      return res;
    },
  });

  return (
    <div className={cn(styles.container)}>
      {data && (
        <>
          <UserInfo
            userId={data.id}
            nickname={data.nickname}
            image={data.image}
            description={data.description}
            follower={data.followersCount}
            folloing={data.followeesCount}
            isfollow={data.isFollowing}
          />
          <div className={styles.activity}>
            <section>
              <p className={styles.activityDetailText}>활동 내역</p>
              <div className={styles.activityDetails}>
                <Activity
                  title='남긴 별점 평균'
                  averageRating={data.averageRating}
                />
                <Activity
                  title='남긴 리뷰'
                  reviewCount={data.reviewCount}
                />
                <Activity
                  title='관심 카테고리'
                  chipCategoty={data.mostFavoriteCategory}
                />
              </div>
            </section>
            <UserActivityList userId={params.userId} />
          </div>
        </>
      )}
    </div>
  );
}
