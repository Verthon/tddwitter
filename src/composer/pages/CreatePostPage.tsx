

import { useTranslation } from "src/i18n/useTranslation";
import { Shell } from "../../core/shell/Shell";
import { Heading } from "../../ui/heading/Heading";

export const CreatePostPage = () => {
  const { t } = useTranslation();

  return (
    <Shell>
      <Heading as="h1">{t("composer.createPost.heading")}</Heading>
    </Shell>
  );
};

export default CreatePostPage;
