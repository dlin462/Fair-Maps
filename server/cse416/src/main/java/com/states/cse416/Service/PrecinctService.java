package com.states.cse416.Service;

import com.states.cse416.Models.Precinct;
import com.states.cse416.Models.PrecinctBoundary;
import com.states.cse416.Repository.PrecinctBoundaryRepository;
import com.states.cse416.Repository.PrecinctRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrecinctService {
    @Autowired
    private PrecinctRepository precinctRepository;
    @Autowired
    private PrecinctBoundaryRepository precinctBoundaryRepository;


    public List<Precinct> getAllPrecincts() {
        return precinctRepository.findAll();
    }

    public List<PrecinctBoundary> getPrecinctBoundaries() {
//        return precinctBoundaryRepository.findAll()
//                .stream()
//                .map(precinctBoundaryDTOMapper)
//                .collect(Collectors.toList());
        return precinctBoundaryRepository.findAll();
    }

}
