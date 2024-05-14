package com.states.cse416.Service;

import com.states.cse416.Models.OpportunityDistrict;
import com.states.cse416.Models.enums.StateName;
import com.states.cse416.Repository.OpportunityDistrictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpportunityDistrictService {
    @Autowired
    private OpportunityDistrictRepository opportunityDistrictRepository;

    public List<OpportunityDistrict> getOpportunityDistrictsByState(StateName state) {
        return opportunityDistrictRepository.findByState(state);
    }
}
