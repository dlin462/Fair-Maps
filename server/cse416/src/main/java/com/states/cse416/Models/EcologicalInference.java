package com.states.cse416.Models;

import com.states.cse416.Models.enums.Race;
import com.states.cse416.Models.enums.StateName;
import lombok.Data;

@Data
public class EcologicalInference {
    private String name;
    private String repName;
    private Race race;
    private double raceProb;
    private StateName state;
    private double[] data;
    private double mean;
    private double std;
}
