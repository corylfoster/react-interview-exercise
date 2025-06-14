export const Button = {
  // The styles all button have in common
  baseStyle: {
    fontWeight: "bold",
    borderRadius: "25px", // <-- border radius is same for all variants and sizes
    _hover: {
      bg: "black",
    },
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "sm",
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: "md",
      px: 6, // <-- these values are tokens from the design system
      py: 4, // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      border: "2px solid",
    },
    ghost: {
      border: "0px solid",
    },
    solid: {
      color: "white",
    },
    redButton: {
      bg: "brand.darkYellow",
      transition: "transform 175ms ease-in-out, box-shadow 175ms ease-in-out",
      boxShadow: "rgba(0, 0, 0, 0.14) 1px 3px 8px",
      transformOrigin: "50% center",
      _hover: {
        transform: "scale(1.035)",
        boxShadow: "rgba(0, 0, 0, 0.2) 2px 4px 10px",
        bg: "brand.darkYellow",
      },
      _active: {
        transform: "scale(1)",
        boxShadow: "rgba(0, 0, 0, 0.14) 1px 3px 8px",
      },
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "outline",
  },
};
