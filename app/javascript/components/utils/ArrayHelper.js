export const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

export const sumBy = (records, field) => {
  if (!records) return
  return records.reduce((acc, obj) => acc + parseFloat(obj[field] || 0), 0)
}

export const joinBy = (records, field, separator = ',') => {
  if (!records) return
  return records.reduce((acc, obj) => {
    return acc ? `${acc}${separator} ${obj[field] || ''}` : obj[field] || ''
  }, '')
}

export const minBy = (records, field) => {
  if (!records) return
  return records.reduce(
    (min, rec) => (rec[field] < min ? rec[field] : min),
    records[0][field]
  )
}
