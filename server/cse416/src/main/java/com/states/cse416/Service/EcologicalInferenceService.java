package com.states.cse416.Service;

import com.states.cse416.Models.EcologicalInference;
import com.states.cse416.Repository.EcologicalInferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EcologicalInferenceService {
    @Autowired
    private EcologicalInferenceRepository ecologicalInferenceRepository;

    public List<EcologicalInference> getEcologicalInference() {
        return ecologicalInferenceRepository.findAll();
    }
}
