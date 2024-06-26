"use client";

import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRef, useState } from "react";
import { useSessionCheck } from "@/hooks/useSessionCheck";
import cn from "@/utils/classNames";
import { LOGO_IMAGE, MENU_TOGGLE_ICON, CLOSE_ICON } from "@/utils/constant";
import styles from "./Gnb.module.scss";
import { SearchInput } from "./SearchInput";

type GnbProps = {
  initialSession: Session | null;
};

export default function Gnb({ initialSession }: GnbProps) {
  const [currentSession, setCurrentSession] = useState(initialSession);

  const [isInputOpen, setInputOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const inputRef = useRef<() => void>(() => {});

  const handleLogoClick = () => {
    inputRef.current();
  };

  const handleSearchClick = () => {
    setInputOpen(!isInputOpen);
  };

  const handleMenuClick = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    handleMenuClose();
  };

  const handleSession = (session: Session | null) => {
    setCurrentSession(session);
  };

  useSessionCheck(initialSession, handleSession);

  return (
    <div className={cn(styles.container)}>
      <Image
        className={styles.menuIcon}
        src={MENU_TOGGLE_ICON}
        width={24}
        height={24}
        alt='메뉴'
        onClick={handleMenuClick}
      />

      <div className={styles.logoBox}>
        <Link href='/'>
          <Image
            className={cn(styles.logo, isInputOpen && styles.invisible)}
            src={LOGO_IMAGE}
            width={166}
            height={28}
            alt='로고'
            priority
            onClick={handleLogoClick}
          />
        </Link>
      </div>

      <div className={styles.actionBox}>
        <SearchInput
          isOpen={isInputOpen}
          inputRef={inputRef}
          onClick={handleSearchClick}
        />

        <div className={cn(styles.sidebar, isMenuOpen && styles.open)}>
          <Image
            className={cn(styles.closeIcon)}
            src={CLOSE_ICON}
            width={18}
            height={18}
            alt='닫기'
            onClick={handleMenuClick}
          />
          <div className={cn(styles.userAction, isMenuOpen && styles.open)}>
            {currentSession ? (
              <>
                <Link
                  href='/compare'
                  onClick={handleMenuClose}
                >
                  비교하기
                </Link>
                <Link
                  href={`/user/${currentSession.user.id}`}
                  onClick={handleMenuClose}
                >
                  내 프로필
                </Link>
                <span
                  onClick={handleSignOut}
                  onKeyDown={handleSignOut}
                  role='button'
                  tabIndex={0}
                >
                  로그아웃
                </span>
              </>
            ) : (
              <>
                <Link
                  href='/signin'
                  onClick={handleMenuClose}
                >
                  로그인
                </Link>
                <Link
                  href='/signup'
                  onClick={handleMenuClose}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
