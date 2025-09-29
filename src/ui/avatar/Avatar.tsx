import { Avatar as BaseAvatar } from "@base-ui-components/react/avatar";

type AvatarProps = {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  fallback?: string;
};

export const Avatar = ({
  src,
  alt,
  size = 32,
  className,
  fallback,
}: AvatarProps) => {
  const initials = (fallback ?? alt)
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <BaseAvatar.Root
      className={`inline-flex items-center justify-center rounded-full bg-neutral-200 text-neutral-700 ${
        className ?? ""
      }`}
      style={{ width: size, height: size }}
    >
      <BaseAvatar.Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="w-full h-full rounded-full object-cover"
      />

      <BaseAvatar.Fallback className="select-none text-sm font-medium">
        {initials}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
};
