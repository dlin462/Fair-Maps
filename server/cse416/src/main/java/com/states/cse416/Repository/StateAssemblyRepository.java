package com.states.cse416.Repository;

import com.states.cse416.Models.StateAssembly;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StateAssemblyRepository extends MongoRepository<StateAssembly, ObjectId> {

}
