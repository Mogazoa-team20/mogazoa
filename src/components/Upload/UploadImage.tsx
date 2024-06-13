import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { UseFormRegister, UseFormSetValue, FieldValues, Path, PathValue } from "react-hook-form";
import cn from "@/utils/classNames";
import { PHOTO_ICON } from "@/utils/constant";
import HttpClient from "@/utils/httpClient";
import LoadingSpinner from "./LoadingSpinner";
import styles from "./UploadImage.module.scss";

type UploadImageProps<T extends FieldValues> = {
  name: Path<T>;
  className?: string;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
};

export default function UploadImage<T extends FieldValues>({
  name,
  className = styles.default,
  register,
  setValue,
}: UploadImageProps<T>) {
  const session = useSession();
  const accessToken = session.data?.accessToken;
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const httpClient = new HttpClient(process.env.NEXT_PUBLIC_BASE_URL || "");

  const handleUploadButtonClick = () => {
    if (fileInputRef?.current) fileInputRef.current.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    if (event.target.files) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("image", file);
      const uploadResponse = await httpClient.post<{ url: string }, FormData>("images/upload", {
        headers: { Authorization: `beareer ${accessToken}` },
        body: formData,
      });
      const imageURL = uploadResponse.url;
      setValue(name, imageURL as PathValue<T, Path<T>>);
    }
    setIsUploading(false);
  };

  return (
    <section>
      <div className={cn(styles.layout, className)}>
        {image && (
          <Image
            className={styles.productImage}
            src={image}
            width={200}
            height={200}
            alt='product'
          />
        )}
        <button
          className={cn(styles.uploadButton, !image && styles.noneImage)}
          type='button'
          onClick={handleUploadButtonClick}
        >
          <input
            className={styles.uploadInput}
            type='file'
            accept='image/*'
            style={{ display: "none" }}
            ref={(e) => {
              register(name).ref(e);
              fileInputRef.current = e;
            }}
            onChange={handleImageChange}
          />
          <Image
            className={styles.uploadImage}
            src={PHOTO_ICON}
            alt='upload'
            width={100}
            height={100}
          />
          <p className={styles.uploadText}>이미지 선택하기</p>
        </button>
        {isUploading && <LoadingSpinner title='Loading..' />}
      </div>
    </section>
  );
}
