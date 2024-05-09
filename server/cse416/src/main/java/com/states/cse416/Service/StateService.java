package com.states.cse416.Service;

import com.states.cse416.Models.State;
import com.states.cse416.Models.StateAssembly;
import com.states.cse416.Models.enums.StateName;
import com.states.cse416.Repository.StateAssemblyRepository;
import com.states.cse416.Repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StateService {
    @Autowired
    private StateAssemblyRepository stateAssemblyRepository;

    @Autowired
    private StateRepository stateRepository;

    @Cacheable("TableCache")
    public List<StateAssembly> getTableByState(StateName stateName) {
        return stateAssemblyRepository.findByState(stateName);
    }

    @Cacheable("StateMeasures")
    public State getStatewideMeasures(StateName state) {
        return  stateRepository.findByState(state);
    }
}
