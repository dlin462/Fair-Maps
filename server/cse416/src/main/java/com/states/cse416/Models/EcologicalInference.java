package com.states.cse416.Models;

import com.states.cse416.Models.enums.Candidate;
import com.states.cse416.Models.enums.ElectionType;
import com.states.cse416.Models.enums.Race;
import com.states.cse416.Models.enums.StateName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "eco_infer")
public class EcologicalInference {
    @Id
    private ObjectId id;
    private String[] uniqueId;
    private StateName state;
    private Race race;
    private Candidate candidate;
    private ElectionType electionType;
    private double[] raceData;
    private double[] complementData;
    private double[] kdePolar;
    private double[] confidInterval;
    private double[] precinctChoropleth;
}
