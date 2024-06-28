class ApiFeatures {
  constructor(query, reqQuery) {
    this.query = query;
    this.reqQuery = reqQuery;
  }

  filter() {
    /** filter the unwanted query parameters meant for sorting, paginating, etc. */
    let reqQueryCopy = {...this.reqQuery};
    ['page', 'sort', 'limit', 'fields'].forEach(current => delete reqQueryCopy[current]);

    /** replace gte|gt|lte|lt with their mongo db operators */
    let advQuery = JSON.stringify(reqQueryCopy);
    advQuery = advQuery.replace(/(gte|gt|lte|lt)\b/g, match => `$${match}`);
    advQuery = JSON.parse(advQuery);

    this.query = this.query.find(advQuery);

    return this;
  }

  paginate() {
    const page = this.reqQuery.page || 1;
    const limit = this.reqQuery.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }

    return this;
  }

  limitFields() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }

    return this;
  }

  enableSearchByFieldsFor(...fieldsArr) {
    fieldsArr.forEach(current => {
      this.query = this.query.find({ [current]: {$regex: new RegExp(this.reqQuery[current], 'i')} });
    })

    /** Since the query params in fieldsArr are already handled in this method, they need to be 
     * removed from the request query object so that they don't affect the results on chaining
     * other filter methods
     */
    fieldsArr.forEach(current => delete this.reqQuery[current]);

    return this;
  }
}

module.exports = ApiFeatures;
