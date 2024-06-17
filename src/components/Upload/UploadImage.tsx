import Image from "next/image";
import { useRef, useState } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  FieldValues,
  Path,
  PathValue,
  FieldErrors,
  RegisterOptions,
  UseFormTrigger,
} from "react-hook-form";
import cn from "@/utils/classNames";
import { PHOTO_ICON } from "@/utils/constant";
import CropperModal from "./Cropper/CropperModal";
import styles from "./UploadImage.module.scss";

type UploadImageProps<T extends FieldValues> = {
  name: Path<T>;
  className?: string;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  trigger: UseFormTrigger<T>;
  rules?: RegisterOptions;
  errors?: FieldErrors<T>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function UploadImage<T extends FieldValues>({
  name,
  className = styles.default,
  register,
  setValue,
  trigger,
  rules,
  errors,
  ...rest
}: UploadImageProps<T>) {
  const error = errors?.[name];
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadButtonClick = () => {
    if (fileInputRef?.current) fileInputRef.current.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setShowModal(true);
    }
  };

  const onCrop = async (croppedImage: Blob) => {
    setImage(URL.createObjectURL(croppedImage));
    setValue(name, croppedImage as PathValue<T, Path<T>>);
    trigger(name);
    setShowModal(false);
  };

  return (
    <>
      <div className={cn(styles.layout, className)}>
        {image && (
          <Image
            className={styles.productImage}
            src={image}
            width={300}
            height={300}
            alt='product'
          />
        )}
        <button
          className={cn(styles.uploadButton, !image && styles.noneImage, error && styles.error)}
          type='button'
          onClick={handleUploadButtonClick}
        >
          <input
            className={styles.uploadInput}
            type='file'
            accept='image/*'
            {...register(name, rules)}
            {...rest}
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <Image
            className={styles.uploadImage}
            src={PHOTO_ICON}
            width={80}
            height={80}
            alt='upload'
          />
          <p className={styles.uploadText}>이미지 선택하기</p>
        </button>
        {showModal && (
          <CropperModal
            image={image}
            onCrop={onCrop}
          />
        )}
        {error && <span className={styles.errorMessage}>{error.message as string}</span>}
      </div>
    </>
  );
}
