package com.states.cse416.Service;

import com.states.cse416.Models.State;
// import com.states.cse416.Models.PrecinctDTO;
import com.states.cse416.Repository.StateWideDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StateWideDataService {
    @Autowired
    private StateWideDataRepository stateWideDataRepository;

    public List<State> getTable() {
        return stateWideDataRepository.findAll();
    }
}
