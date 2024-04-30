package com.states.cse416.Repository;

import com.states.cse416.Models.PrecinctBoundary;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PrecinctBoundaryRepository extends MongoRepository<PrecinctBoundary, ObjectId> {
}
