package com.states.cse416.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.states.cse416.Models.DemographicData;

public interface DemographicRepository extends MongoRepository<DemographicData, Object> {

}
