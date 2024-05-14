package com.states.cse416.Models;

import com.states.cse416.Models.enums.Race;
import com.states.cse416.Models.enums.StateName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "opportunity_districts")
public class OpportunityDistrict {
    @Id
    private ObjectId id;
    private StateName state;
    private Race race;
    private double idealPop;
    private double racePop;
    private double enactedOpp;
    @DBRef
    private Threshold firstThreshold;
    @DBRef
    private Threshold secondThreshold;
    @DBRef
    private Threshold thirdThreshold;

}
