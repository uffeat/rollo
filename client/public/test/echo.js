export default (...args) => {
  if (!args.length) {
    return null
  }
  if (args.length === 1) {
    return args[0]
  }
  return args

} 