package com.states.cse416.Service;

import com.states.cse416.Models.Precinct;
import com.states.cse416.Models.enums.StateName;
import com.states.cse416.Repository.PrecinctRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.stereotype.Service;

import java.util.List;

@EnableCaching
@Service
public class PrecinctService {
    @Autowired
    private PrecinctRepository precinctRepository;

    @Cacheable("PrecinctCache")
    public List<Precinct> getAllPrecinctsByState(StateName stateName) {
        return precinctRepository.findByState(stateName);
    }



}
