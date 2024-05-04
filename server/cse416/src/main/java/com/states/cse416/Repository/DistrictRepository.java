package com.states.cse416.Repository;


import com.states.cse416.Models.StateAssembly;
import com.states.cse416.Models.enums.StateName;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.states.cse416.Models.District;
import org.bson.types.ObjectId;

import java.util.List;


public interface DistrictRepository extends MongoRepository<District, ObjectId> {
    List<District> findByState(StateName state);
    District findByStateAndDistrictNum(StateName state, int districtNum);
}
