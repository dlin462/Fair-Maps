package com.states.cse416.Service;

import com.states.cse416.Models.District;
import com.states.cse416.Repository.DistrictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class DistrictService {
    
    @Autowired
    private DistrictRepository districtRepository;

    public List<District> getAllDistricts() {
        return districtRepository.findAll();
    }
}
