package com.states.cse416.Repository;

import com.states.cse416.Models.State;
import com.states.cse416.Models.enums.StateName;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StateWideDataRepository extends MongoRepository<State, ObjectId> {
    List<State> findByState(StateName state);
}
