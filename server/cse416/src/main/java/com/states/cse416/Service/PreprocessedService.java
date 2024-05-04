package com.states.cse416.Service;

import com.states.cse416.Models.Precinct;
import com.states.cse416.Models.enums.BarChart;
import com.states.cse416.Models.enums.Party;
import com.states.cse416.Models.enums.StateName;
import com.states.cse416.Repository.PrecinctRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PreprocessedService {

    @Autowired
    PrecinctRepository precinctRepository;
    public List<Integer> getBarChartByState(StateName state, BarChart chartType) {

    }

    public List<Map<Party, Integer>> getVoteResults() {

    }

    public List<Object> getEcologicalInference() {

    }

    public List<Object> getGinglesByPrecinct(Precinct precinct) {

    }

    public List<Object> getGinglesNonLinearReg(StateName state) {

    }
}
