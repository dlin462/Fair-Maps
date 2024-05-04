package com.states.cse416.Repository;

import com.states.cse416.Models.Precinct;
import com.states.cse416.Models.enums.StateName;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PrecinctRepository extends MongoRepository<Precinct, ObjectId> {
    List<Precinct> findByState(StateName state);
}
