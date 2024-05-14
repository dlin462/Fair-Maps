package com.states.cse416.Service;

import com.states.cse416.Models.BoxAndWhisker;
import com.states.cse416.Models.enums.Race;
import com.states.cse416.Models.enums.StateName;
import com.states.cse416.Repository.BoxAndWhiskerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoxAndWhiskerService {
    @Autowired
    private BoxAndWhiskerRepository boxAndWhiskerRepository;

    @Cacheable("BoxWhisker")
    public List<BoxAndWhisker> getBoxAndWhiskerByStateAndRace(StateName state, Race race) {
        return boxAndWhiskerRepository.findByStateAndRaceOrderByDistrictIdAsc(state, race);
    }
}
