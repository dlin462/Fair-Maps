package com.states.cse416.Models;

import com.states.cse416.Models.enums.Party;
import com.states.cse416.Models.enums.StateName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "state_wide_data")
public class State {
    @Id
    private ObjectId id;
    private StateName state;
    private Party redistrictControl;
    private Election presResults;
    private Election guberResults;
    private Election atgResults;
    private DemographicData demographicData;
}
