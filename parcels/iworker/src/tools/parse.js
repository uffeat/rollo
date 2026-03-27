import "../../use";

const { is } = await use("@/rollo/");

/* Returns options, kwargs, args parsed from args */
export const parse = (args) => {
  const options = args.find((a, i) => !i && is.object(a)) || {};
  const kwargs =
    args.find((a, i) => (!i || i === 1) && is.object(a) && a !== options) || {};
  args = args.filter((a, i) => a !== options && a !== kwargs);
  return [options, kwargs, args];
};
