package com.states.cse416.Service;

import com.states.cse416.Mappers.PrecinctBoundaryDTOMapper;
import com.states.cse416.Mappers.PrecinctMapper;
import com.states.cse416.Models.Precinct;
import com.states.cse416.Models.PrecinctBoundary;
import com.states.cse416.Models.PrecinctBoundaryDTO;
import com.states.cse416.Models.PrecinctDTO;
import com.states.cse416.Repository.PrecinctBoundaryRepository;
import com.states.cse416.Repository.PrecinctRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PrecinctService {
    @Autowired
    private PrecinctRepository precinctRepository;
    @Autowired
    private PrecinctMapper precinctMapper;
    @Autowired
    private PrecinctBoundaryRepository precinctBoundaryRepository;
    @Autowired
    private PrecinctBoundaryDTOMapper precinctBoundaryDTOMapper;


    public List<PrecinctDTO> getAllPrecinctDTOs() {
        return precinctRepository.findAll()
                .stream()
                .map(precinctMapper::convertToPrecinctDTO)
                .collect(Collectors.toList());
    }

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

    public Optional<PrecinctBoundaryDTO> getPrecinctBoundaryById(ObjectId id) {
        return precinctBoundaryRepository.findById(id).map(precinctBoundaryDTOMapper);
    }
}
