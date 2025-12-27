import { type ComponentPropsWithoutRef, type ElementType } from "react";

type PaddingValue = 2 | 4 | 6 | 12;
type ResponsivePadding = PaddingValue | [PaddingValue, PaddingValue, PaddingValue];

type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
type FlexJustify = "start" | "end" | "center" | "between" | "around" | "evenly";

type BoxOwnProps<T extends ElementType = "div"> = {
  component?: T;
  padding?: ResponsivePadding;
  direction?: FlexDirection;
  justify?: FlexJustify;
};

type BoxProps<T extends ElementType = "div"> = BoxOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof BoxOwnProps<T>>;

const directionMap: Record<FlexDirection, string> = {
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
  column: "flex-col",
  "column-reverse": "flex-col-reverse",
};

const justifyMap: Record<FlexJustify, string> = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const getPaddingClasses = (padding: ResponsivePadding | undefined): string => {
  if (!padding) return "";

  if (Array.isArray(padding)) {
    const [mobile, tablet, desktop] = padding;
    return `p-${mobile} md:p-${tablet} lg:p-${desktop}`;
  }

  return `p-${padding}`;
};

export const Box = <T extends ElementType = "div">({
  component,
  padding,
  direction = "row",
  justify = "start",
  children,
  ...props
}: BoxProps<T>) => {
  const Component = component || "div";

  const classes = [
    "flex",
    directionMap[direction],
    justifyMap[justify],
    getPaddingClasses(padding),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};
