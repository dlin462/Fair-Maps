package com.states.cse416.Service;

import com.states.cse416.Models.DemographicData;
// import com.states.cse416.Models.PrecinctDTO;
import com.states.cse416.Repository.DemographicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemographicService {
    @Autowired
    private DemographicRepository DemographicRepository;

    public List<DemographicData> getDemographicData() {
        return DemographicRepository.findAll();
    }
}
