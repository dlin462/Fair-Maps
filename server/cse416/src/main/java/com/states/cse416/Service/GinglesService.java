package com.states.cse416.Service;

import com.states.cse416.Models.Gingles;
import com.states.cse416.Models.enums.Race;
import com.states.cse416.Models.enums.StateName;
import com.states.cse416.Repository.GinglesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GinglesService {
    @Autowired
    private GinglesRepository ginglesRepository;

    @Cacheable("GinglesCache")
    public List<Gingles> getGinglesByStateAndRace(StateName state, Race race) {
        return ginglesRepository.findByStateAndRace(state, race);
    }
}
