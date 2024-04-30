package com.states.cse416.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.states.cse416.Models.District;

public interface DistrictRepository extends MongoRepository<District, Object> {

}
