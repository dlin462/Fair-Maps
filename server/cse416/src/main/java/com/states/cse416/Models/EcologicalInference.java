package com.states.cse416.Models;

import com.states.cse416.Models.enums.Race;
import com.states.cse416.Models.enums.StateName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "eco_infer")
public class EcologicalInference {
    private String name;
    private String repName;
    private Race race;
    private double raceProb;
    private StateName state;

    private double[] asian;
    private double[] other;

    private double mean;
    private double std;
}
