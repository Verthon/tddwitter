import { useState } from "react";
import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { useTranslation } from "src/i18n/useTranslation";
import { Button } from "../../ui/Button/Button";
import { Heading } from "../../ui/heading/Heading";
import { Box } from "../../ui/box/Box";
import { useCreatePost } from "../hooks/useCreatePost";

const MAX_CHARS = 300;

export const CreatePostForm = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const { mutate, isPending } = useCreatePost();

  const remainingChars = MAX_CHARS - content.length;
  const isOverLimit = remainingChars < 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isOverLimit && content.trim().length > 0) {
      mutate({ content: content.trim() });
    }
  };

  return (
    <Box direction="column" justify="center" padding={[4, 6, 12]}>
      <Form
        onSubmit={handleSubmit}
        className="flex w-full max-w-2xl flex-col gap-4"
        aria-labelledby="create-post-heading"
      >
        <Heading as="h1" id="create-post-heading">
          {t("composer.createPost.heading")}
        </Heading>
        <Field.Root name="content" className="flex flex-col items-start gap-2">
          <Field.Label className="sr-only">
            {t("composer.form.label")}
          </Field.Label>
          <Field.Control
            render={(props) => (
              <textarea
                {...props}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (props.onChange) {
                    props.onChange(e);
                  }
                }}
                placeholder={t("composer.placeholder")}
                rows={4}
                aria-describedby="message-limit"
                aria-controls="message-limit"
                disabled={isPending}
                className="w-full resize-none rounded-md border border-gray-200 p-3.5 text-base text-gray-900 placeholder-gray-500 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
              />
            )}
          />
          <div className="flex w-full items-center justify-between">
            <Field.Error className="text-sm text-red-800" />
            <output
              id="char-count"
              className={`text-sm ${
                isOverLimit ? "font-semibold text-red-800" : "text-gray-600"
              }`}
            >
              {t("composer.form.charCount", {
                remaining: remainingChars,
                max: MAX_CHARS,
              })}
            </output>
          </div>
        </Field.Root>
        <Button
          type="submit"
          isDisabled={isOverLimit || content.trim().length === 0 || isPending}
          variant="primary"
          size="lg"
        >
          {t("composer.button.tweet")}
        </Button>
      </Form>
    </Box>
  );
};
