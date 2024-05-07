package com.states.cse416.Repository;

import com.states.cse416.Models.State;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateRepository extends MongoRepository<State, ObjectId> {
}
