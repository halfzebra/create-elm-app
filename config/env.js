function getClientEnvironment () {
  return Object
    .keys(process.env)
    .reduce((acc, current) => {
      acc[ `process.env.${current}` ] = `"${process.env[ current ]}"`
      return acc
    }, {})
}

module.exports = getClientEnvironment
