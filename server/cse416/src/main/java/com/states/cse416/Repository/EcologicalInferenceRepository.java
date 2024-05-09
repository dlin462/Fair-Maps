package com.states.cse416.Repository;

import com.states.cse416.Models.EcologicalInference;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EcologicalInferenceRepository extends MongoRepository<EcologicalInference, ObjectId> {

}
