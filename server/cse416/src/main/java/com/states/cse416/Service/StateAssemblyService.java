package com.states.cse416.Service;

import com.states.cse416.Models.StateAssembly;
// import com.states.cse416.Models.PrecinctDTO;
import com.states.cse416.Repository.StateAssemblyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StateAssemblyService {
    @Autowired
    private StateAssemblyRepository stateAssemblyRepository;

    public List<StateAssembly> getTable() {
        return stateAssemblyRepository.findAll();
    }
}
