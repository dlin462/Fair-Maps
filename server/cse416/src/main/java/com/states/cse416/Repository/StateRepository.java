package com.states.cse416.Repository;

import com.states.cse416.Models.State;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StateRepository extends MongoRepository<State, ObjectId> {
}
