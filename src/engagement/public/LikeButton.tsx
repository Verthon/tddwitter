import { ErrorBoundary } from "react-error-boundary";

import { LikeButtonComponent } from "../components/LikeButton";
import { useLocale } from "src/i18n/useLocale";

type LikeButtonProps = Parameters<typeof LikeButtonComponent>[0];

export const LikeButton = (props: LikeButtonProps) => {
  const { t } = useLocale();

  return (
    <ErrorBoundary fallback={<span className="inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{t("engagement.likeDisasterRecovery")}</span>}>
      <LikeButtonComponent {...props} />
    </ErrorBoundary>
  );
};
