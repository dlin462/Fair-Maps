package com.states.cse416.Repository;

import com.states.cse416.Models.BoxAndWhisker;
import com.states.cse416.Models.enums.Race;
import com.states.cse416.Models.enums.StateName;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoxAndWhiskerRepository extends MongoRepository<BoxAndWhisker, ObjectId> {
    List<BoxAndWhisker> findByStateAndRaceOrderByDistrictIdAsc(StateName state, Race race);
}
