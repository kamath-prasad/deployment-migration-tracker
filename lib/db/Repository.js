'use strict';

const _ = require('lodash');
const Mongoose = require('mongoose');
const Promise = require('bluebird');
Promise.promisifyAll([
  require('mongoose/lib/model'),
  require('mongoose/lib/query')
]);

/**
 * Implements the Repository pattern. Provides a generic DAO for all model CRUD operations
 */
class Repository {
  static save(modelName, model, user, populateOptions) {
    if (_.isEmpty(user) || (_.isEmpty(user.email) && _.isEmpty(user.name))) {
      throw new Error('user.email or user.name is mandatory for save operation');
    }
    const Model = Mongoose.model(modelName);
    const modelId = _.get(model, '_id');
    delete model._id;
    const updatedAt = new Date();
    if (Model.schema.obj.updatedAt !== undefined) {
      //Created At/By fields are mandatory. However updated fields could be optional for insert only type of collections.
      model.updatedAt = updatedAt;
      model.updatedBy = user.email || user.name;
    }
    //User object will have either email & name or just name. Email has precedence
    if (modelId !== undefined) {
      return Model
        .findOneAndUpdateAsync({
          _id: modelId
        }, model, {
          upsert: true
        }).then(() => {
          console.log(`Update of ${modelName} Succeeded`);
          return this.findById(modelName, modelId, populateOptions);
          //Returning the latest doc from DB for consistency
        });
    } else {
      model.createdAt = updatedAt;
      model.createdBy = user.email || user.name;
      const newModel = new Model(model);
      return newModel.saveAsync();
    }
  }

  static saveOrUpdate(modelName, model, criteria, user, populateOptions) {
    if (_.keys(criteria).length === 0) {
      throw new Error('SaveOrUpdate must have a non empty criteria object');
    }
    return this
      .findOne(modelName, criteria, populateOptions)
      .then(modelInDB => {
        if (modelInDB === null) {
          modelInDB = {};
        }
        delete model._id;
        _.assign(modelInDB, model);
        return this.save(modelName, modelInDB, user, populateOptions);
      });
  }

  static findById(modelName, id, populateOptions) {
    const Model = Mongoose.model(modelName);
    return Model
      .findByIdAsync(id)
      .then(model => {
        if (populateOptions) {
          return Model.populateAsync(model, populateOptions);
        }
        return model;
      });
  }

  static delete(modelName, criteria) {
    const Model = Mongoose.model(modelName);
    return Model
      .removeAsync(criteria);
  }

  static findOne(modelName, criteria, populateOptions) {
    return Promise.try(() => {
      const Model = Mongoose.model(modelName);
      return Model
        .findOne(criteria)
        .lean()
        .execAsync()
        .then(model => {
          if (populateOptions) {
            return Model.populateAsync(model, populateOptions);
          }
          return model;
        });
    });
  }

  static search(modelName, searchCriteria, paginateOpts) {
    console.log(`Search on : ${modelName} with searchCriteria : ${JSON.stringify(searchCriteria)}`);
    const Model = Mongoose.model(modelName);
    let populateOptions;
    let sortBy;
    let searchBy;

    if (searchCriteria &&
      (searchCriteria.populateOptions || searchCriteria.sortBy || searchCriteria.searchBy)) {
      populateOptions = searchCriteria.populateOptions;
      sortBy = searchCriteria.sortBy;
      searchBy = searchCriteria.searchBy;
    } else {
      searchBy = searchCriteria || {};
    }
    if (!paginateOpts) {
      paginateOpts = {
        records: 10,
        offset: 0
      };
    }
    if (paginateOpts.records > 10) {
      paginateOpts.records = 10;
    }
    console.log(`Search : ${modelName} with criteria : ${JSON.stringify(searchBy)} - ${paginateOpts}`);
    return Model
      .find(searchBy)
      .count()
      .execAsync()
      .then(count => {
        console.log(`Number of items for : ${modelName} with set criteria - ${count}`);
        const offset = parseInt(paginateOpts.offset);
        const noOfrecordsTobeFetched = parseInt(paginateOpts.records);
        let nxtoffset = offset + noOfrecordsTobeFetched;
        let searchObj = Model.find(searchBy);
        if (populateOptions) {
          searchObj = searchObj.populate(populateOptions);
        }
        if (sortBy) {
          searchObj = searchObj.sort(sortBy);
        }
        return searchObj
          .skip(offset)
          .limit(noOfrecordsTobeFetched)
          .execAsync()
          .then(resultList => {
            console.log(`Retrieved : ${paginateOpts.offset} to ${resultList.length} out of ${count} records for  ${modelName}`);
            if (nxtoffset >= count) {
              nxtoffset = -1;
            }
            const result = {
              list: resultList,
              totalRecordCount: count,
              nextOffset: nxtoffset
            };
            console.log(`Returning : ${modelName} - List : ${JSON.stringify(result)}`);
            return result;
          });
      });
  }
}

module.exports = Repository;