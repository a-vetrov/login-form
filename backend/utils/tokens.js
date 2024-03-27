export const getFirstSandboxToken = (currentUser) => {
  let result = currentUser.tokens.find((item) => item.type === 'sanbox')

  if (!result) {
    result = currentUser.tokens[0]
  }
  return result || currentUser.tokens[0]
}
