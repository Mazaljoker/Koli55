interface PopularBadgeProps {
  text?: string;
  className?: string;
}

export const PopularBadge = ({
  text = "LE PLUS POPULAIRE",
  className,
}: PopularBadgeProps) => {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        top: "-12px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--allokoli-primary-default)",
        color: "white",
        borderRadius: "var(--allokoli-radius-xl)",
        padding: "var(--allokoli-spacing-1) var(--allokoli-spacing-3)",
        fontSize: "12px",
        fontWeight: "bold",
        zIndex: 10,
      }}
    >
      {text}
    </div>
  );
};
