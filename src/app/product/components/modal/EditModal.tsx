"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { ModalProps } from "@/app/product/utils/types";
import Button from "@/components/Button/Button";
import { Dropdown } from "@/components/Dropdown";
import Input from "@/components/Input/Input";
import TextArea from "@/components/Input/TextArea";
import useUploadImageMutation from "@/components/Upload/hooks/useUploadImageMutation";
import UploadImage from "@/components/Upload/ImageUpload/ImageUpload";
import { useGetCategory } from "@/hooks/useGetCategory";
import cn from "@/utils/classNames";
import HttpClient from "@/utils/httpClient";
import styles from "./EditModal.module.scss";
import type { ItemType } from "@/components/Dropdown/type";
import type { CategoryType } from "@/types/global";

type FormValues = {
  productName: string;
  croppedImage: Blob;
  category: number;
  description: string;
  image: File;
};

export default function EditModal({ productDetail, session }: ModalProps) {
  const { id, name, image, categoryId, description } = productDetail;
  const accessToken = session?.accessToken || "";
  const httpClient = new HttpClient(process.env.NEXT_PUBLIC_BASE_URL || "");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      productName: name,
      category: categoryId,
      description,
    },
  });

  const { data: categoryList, isPending } = useGetCategory();
  const uploadImageMutation = useUploadImageMutation();

  if (isPending) {
    return null;
  }

  const categories: ItemType[] = categoryList?.map((category: CategoryType) => ({
    value: category.id,
    option: category.name,
  }));

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const url = data.croppedImage?.size ? await uploadImageMutation.mutateAsync(data.croppedImage) : image;
    const productData = {
      name: data.productName,
      description: data.description,
      categoryId: data.category,
      image: url,
    };
    httpClient.patch(
      `/products/${id}`,
      { headers: { Authorization: `Bearer: ${accessToken}`, "Content-Type": "application/json" } },
      JSON.stringify(productData),
    );
    window.location.reload();
  };

  return (
    <div className={cn(styles.container)}>
      <div className={cn(styles.content)}>
        <h2 className={cn(styles.header)}>상품 수정하기</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn(styles.form)}
        >
          <UploadImage
            name='image'
            cropFiledName='croppedImage'
            register={register}
            setValue={setValue}
            defaultImage={image}
            className={cn(styles.imageUploader)}
          />

          <Input
            name='productName'
            register={register}
            rules={{ required: "상품 이름은 필수 입력입니다." }}
            errors={errors}
            type='text'
            placeholder='상품명(상품 등록 여부를 확인해 주세요)'
            maxLength={20}
            className={cn(styles.input)}
          />

          <Dropdown
            items={categories}
            control={control}
            name='category'
            placeholder='카테고리 선택'
            rules={{ required: "카테고리를 선택해주세요." }}
            className={cn(styles.dropdown)}
          />

          <TextArea
            name='description'
            rows={5}
            control={control}
            rules={{
              required: "상품 설명은 필수 입력입니다.",
              minLength: { value: 10, message: "최소 10자 이상 적어주세요." },
              maxLength: 500,
            }}
            errors={errors}
            maxLength={500}
            className={styles.textarea}
            defaultValue={description}
          />

          <Button
            type='submit'
            styleType='primary'
            className={cn(styles.submitButton)}
            disabled={!isValid}
          >
            제출하기
          </Button>
        </form>
      </div>
    </div>
  );
}
