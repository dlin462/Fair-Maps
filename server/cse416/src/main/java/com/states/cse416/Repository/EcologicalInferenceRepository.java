package com.states.cse416.Repository;

import com.states.cse416.Models.EcologicalInference;
import com.states.cse416.Models.enums.Candidate;
import com.states.cse416.Models.enums.ElectionType;
import com.states.cse416.Models.enums.Race;
import com.states.cse416.Models.enums.StateName;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EcologicalInferenceRepository extends MongoRepository<EcologicalInference, ObjectId> {
    List<EcologicalInference> findByStateAndRace(StateName state, Race race);
    List<EcologicalInference> findByStateAndRaceAndElectionType(StateName state, Race race, ElectionType election);

}
