package com.states.cse416.Repository;

import com.states.cse416.Models.StateAssembly;

import com.states.cse416.Models.enums.StateName;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StateAssemblyRepository extends MongoRepository<StateAssembly, ObjectId> {

    List<StateAssembly> findByState(StateName state);
}
