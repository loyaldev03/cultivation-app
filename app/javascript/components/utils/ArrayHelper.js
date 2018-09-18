const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

const sumBy = (records, field) => {
  return records.reduce((acc, obj) => acc + parseFloat(obj[field] || 0), 0)
}

const joinBy = (records, field, separator = ',') => {
  return records.reduce((acc, obj) => {
    return acc ? `${acc}${separator} ${obj[field] || ''}` : obj[field] || ''
  }, '')
}

export { groupBy, sumBy, joinBy }
