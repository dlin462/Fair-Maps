package com.states.cse416.Models;

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
@Document(collection = "non_linear")
public class Gingles {
    @Id
    private ObjectId id;
    private StateName state;
    private Race race;
    private String electionType;
    private double coefficientRep;
    private double coefficientDem;
    private double constantRep;
    private double constantDem;
    private double rootOrderRep;
    private double rootOrderDem;
    private double[] fitLineRep;
    private double[] fitLineDem;
    private double[] xData;
    private double[] yDataRep;
    private double[] yDataDem;
}
