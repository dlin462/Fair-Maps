package com.states.cse416.Service;

import com.states.cse416.Models.Precinct;
import com.states.cse416.Models.PrecinctDTO;
import com.states.cse416.Repository.PrecinctRepository;
import org.locationtech.jts.io.WKTReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrecinctService {
    @Autowired
    private PrecinctRepository precinctRepository;

    private WKTReader wktReader;

    public List<Precinct> getAllPrecincts() {
        return precinctRepository.findAll();
    }

//    private Precinct convertToPrecinct(Precinct precinct) {
//        PrecinctDTO precinctDTO = new PrecinctDTO();
//        precinctDTO.setId()
//
//    }
}
