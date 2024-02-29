export const sendError = (res, status, error, message) => {
  res.status(status)
  .send({
    success: false,
    error: {
      title: error,
      message
    }
  }
  )
}
