module.exports.onError = (req, res, error) => {
  console.error(`${req.method}:${req.path}`, error);
  if (error && error.name != 'SequelizeForeignKeyConstraintError') {
    if (error && error.errors[0].path === 'email_UNIQUE') {
      res.status(409).send({
        status: false,
        error: error.errors[0].message,
        stack: error.toString(),
      });
    } else {
      res.status(500).send({
        status: false,
        error: 'Internal Server Error',
        stack: error.toString(),
      });
    }
  } else {
    res.status(500).send({
      status: false,
      error: 'Internal Server Error',
      stack: error.toString(),
    });
  }
};