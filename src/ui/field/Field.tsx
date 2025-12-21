import { Field as BaseField } from '@base-ui/react/field';

const FieldRoot = (props: BaseField.Root.Props) => (
  <BaseField.Root
    {...props}
    className="flex w-full max-w-64 flex-col items-start gap-1"
  />
);

const FieldLabel = (props: BaseField.Label.Props) => (
  <BaseField.Label
    {...props}
    className="text-sm font-medium text-gray-900 data-[disabled]:opacity-50"
  />
);

const FieldControl = (props: BaseField.Control.Props) => (
  <BaseField.Control
    {...props}
    className="h-10 w-full rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-500 data-[invalid]:border-red-500 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
  />
);

const FieldError = (props: BaseField.Error.Props) => (
  <BaseField.Error {...props} className="text-sm text-red-800" />
);

const FieldDescription = (props: BaseField.Description.Props) => (
  <BaseField.Description {...props} className="text-sm text-gray-600" />
);

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Error: FieldError,
  Description: FieldDescription,
};
