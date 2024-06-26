"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LabelBox } from "@/app/(auth)/_components/LabelBox";
import { SIGNIN_VALIDATION } from "@/app/(auth)/constants";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import PasswordInput from "@/components/Input/PasswordInput";
import { Toast } from "@/components/Toast";
import { getSessionStorage, setSessionStorage } from "@/utils/session";
import styles from "./SignInForm.module.scss";

type SignInFormData = {
  email: string;
  password: string;
};

export default function SignInForm() {
  const [toast, setToast] = useState<Toast | null>(null);
  const {
    register,
    formState: { isValid, errors, isSubmitting },
    setError,
    handleSubmit,
  } = useForm<SignInFormData>({ mode: "onBlur" });
  const router = useRouter();

  const onSubmit = async (data: SignInFormData) => {
    const result = await signIn("signin", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    const prevPath = getSessionStorage("prevPath");

    if (result?.ok && prevPath) {
      setSessionStorage("prevPath", "");
      router.push(prevPath);
      router.refresh();
    } else if (result?.ok) {
      router.push("/");
    } else {
      toast?.error("이메일 혹은 비밀번호를 확인해주세요!");
      setError("email", { type: "loginError", message: "이메일 혹은 비밀번호를 확인해주세요." });
      setError("password", { type: "loginError" });
    }
  };

  useEffect(() => {
    const toastInstance = Toast.getInstance();
    setToast(toastInstance);
  }, []);

  return (
    <form
      className={styles.container}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.inputList}>
        <LabelBox
          htmlFor='email'
          title='이메일'
        >
          <Input
            id='email'
            name='email'
            type='email'
            register={register}
            rules={SIGNIN_VALIDATION.EMAIL}
            errors={errors}
            placeholder='이메일을 입력해 주세요'
          />
        </LabelBox>
        <LabelBox
          htmlFor='password'
          title='비밀번호'
        >
          <PasswordInput
            id='password'
            name='password'
            register={register}
            rules={SIGNIN_VALIDATION.PASSWORD}
            errors={errors}
            placeholder='비밀번호를 입력해 주세요'
            autoComplete='off'
          />
        </LabelBox>
      </div>
      <Button
        styleType='primary'
        disabled={!isValid || isSubmitting}
        className={styles.signInButton}
      >
        {isSubmitting ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
