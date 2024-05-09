package com.states.cse416.Repository;

import com.states.cse416.Models.Gingles;
import com.states.cse416.Models.enums.Race;
import com.states.cse416.Models.enums.StateName;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GinglesRepository extends MongoRepository<Gingles, ObjectId> {
    List<Gingles> findByStateAndRace(StateName state, Race race);
    Gingles findByStateAndRaceAndElectionType(StateName state, Race race, String Election);
}
