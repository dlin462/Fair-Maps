package com.states.cse416.Models;

import com.states.cse416.Models.enums.Party;
import com.states.cse416.Models.enums.StateName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "state")
public class State {
    @Id
    private ObjectId id;
    private StateName state;
    private Party partyControl;
    private int democrat;
    private int republican;
    @Field("pct_dem")
    private double pctDem;
    @Field("pct_rep")
    private double pctRep;
    @DBRef
    private DemographicData demographicData;
}
