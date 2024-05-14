package com.states.cse416.Repository;

import com.states.cse416.Models.OpportunityDistrict;
import com.states.cse416.Models.enums.StateName;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OpportunityDistrictRepository extends MongoRepository<OpportunityDistrict, ObjectId> {
    List<OpportunityDistrict> findByState(StateName state);
}
