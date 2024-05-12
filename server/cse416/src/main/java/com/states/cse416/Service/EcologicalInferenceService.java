package com.states.cse416.Service;

import com.states.cse416.Models.EcologicalInference;
import com.states.cse416.Models.enums.ElectionType;
import com.states.cse416.Models.enums.Race;
import com.states.cse416.Models.enums.StateName;
import com.states.cse416.Repository.EcologicalInferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EcologicalInferenceService {
    @Autowired
    private EcologicalInferenceRepository ecologicalInferenceRepository;

    public List<EcologicalInference> getEcologicalInferenceByState(StateName state, Race race) {
        return ecologicalInferenceRepository.findByStateAndRace(state, race);
    }

    public List<EcologicalInference> getEcologicalInferenceByElectionAndRace(StateName state, Race race, ElectionType election) {
        return ecologicalInferenceRepository.findByStateAndRaceAndElectionType(state, race, election);
    }
}
