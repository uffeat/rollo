const { component } = await use("@/rollo/");

export const Spinner = ({ color = "primary", parent, size='1rem', ...updates } = {}) => {
  return component.div(
    ".d-flex.justify-content-center",
    { parent },
    component.div(
      `spinner-border text-${color}`,
      { 
        role: "status", 
        height: size,
        width: size,
        ...updates },
      component.span("visually-hidden", "Loading...")
    )
  );
};