class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
    // const features = new APIFeatures(Tour.find(), req.query)
    filter() {
        // console.log(this.queryString)
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach(el => delete queryObj[el]);
      console.log('after removing some fields',queryObj)
      // 1B) Advanced filtering
      let queryStr = JSON.stringify(queryObj);
    //   console.log(queryStr)
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      console.log('stringify',queryStr)
  
      this.query = this.query.find(JSON.parse(queryStr));
      console.log('parsed',JSON.parse(queryStr))
  
      return this;
    }
  
    sort() {
        // console.log('sort by',this.queryString.sort)
        // console.log(this.queryString.sort.split(',').join(' '))
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
    }
//projection using mongoose select method 
    limitFields() {
        console.log('limitfields',this.queryString.fields)
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      
      return this;
    }
  //pagination
    paginate() {
        // console.log(this.queryString.limit)
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 4;
      const skip = (page - 1) * limit;
      console.log(page,limit,skip)
      
    this.query = this.query.skip(skip).limit(limit);
    // console.log(this)
    return this;
  }
}
module.exports = APIFeatures;