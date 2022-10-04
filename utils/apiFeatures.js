import { isEmpty } from './utils'

class APIFeatures {
  constructor(queryFunction, queryStr, result) {
    this.queryFunction = queryFunction
    this.queryStr = queryStr
    this.result = result
  }

  search() {
    const query = { ...this.queryStr }
    let queryCopy = { ...query }
    let formattedQuery = {}
    const orderKeys = ['_sort', '_order', '_start', '_end']
    const relationKeys = ['_like', '_gte', '_lte', '_ne']
    const nestedKeys = ['.']

    const nestedQueries = {}
    const orderQueries = {}
    const relationQueries = {}

    Object.keys(queryCopy).forEach((key) => {
      let value = query[key]
      let isOrderKey = orderKeys.findIndex((item) => item === key) !== -1
      if (isOrderKey) {
        orderQueries[key] = value
        return delete queryCopy[key]
      }

      let isRelationKey =
        relationKeys.findIndex((item) => key.includes(item)) !== -1
      if (isRelationKey) {
        relationQueries[key] = value
        return delete queryCopy[key]
      }
      let isNestedKey =
        nestedKeys.findIndex((item) => key.includes(item)) !== -1
      if (isNestedKey) {
        nestedQueries[key] = value
        return delete queryCopy[key]
      }
    })

    Object.keys(relationQueries)?.forEach((item) => {
      let itemKey = item.split('_')[0]
      let relation = item.split('_')[1]
      let value = query[item]
      switch (relation) {
        case 'like': {
          queryCopy[itemKey] = {
            $regex: value,
            $options: 'i',
          }
          // delete relationQueries[item]
        }
        case 'gte': {
          formattedQuery[itemKey] = {
            $gte: value,
          }
        }
        case 'lte': {
          formattedQuery[itemKey] = {
            $lte: value,
          }
        }
        case 'ne': {
          formattedQuery[itemKey] = {
            $ne: value,
          }
        }
        default:
          null
      }
    })

    Object.keys(nestedQueries)?.forEach((key) => {
      let value = nestedQueries[key]

      formattedQuery[`${key}`] = value
    })

    Object.keys(queryCopy).forEach((key) => {
      let value = queryCopy[key]
      formattedQuery[key] = value
    })

    let response = this.queryFunction.find(formattedQuery)

    if (!isEmpty(orderQueries)) {
      let sort = orderQueries['_sort']
      let order = orderQueries['_order']

      response = this.queryFunction.find(formattedQuery).sort({
        [sort]: order,
      })
    }
    this.result = response
    return this
  }

  pagination(limit) {
    const currentPage = Number(this.queryStr.page) || 1
    const skip = limit * (currentPage - 1) //because user requesting new page here , and we are deleting previous page's data..
    this.result = this.queryFunction.limit(limit).skip(skip)
    return this
  }
}

export default APIFeatures
