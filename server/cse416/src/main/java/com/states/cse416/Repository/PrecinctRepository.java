package com.states.cse416.Repository;

import com.states.cse416.Models.Precinct;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PrecinctRepository extends MongoRepository<Precinct, ObjectId> {

}
