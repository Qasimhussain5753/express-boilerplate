exports.getUser = (req, res, next) => {
  res.status(200).send({ success: true, message: `heloo ${req.params.id}` })
}
