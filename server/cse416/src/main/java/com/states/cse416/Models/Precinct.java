package com.states.cse416.Models;

import com.states.cse416.Models.enums.Party;
import com.states.cse416.Models.enums.StateName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.locationtech.jts.geom.Geometry;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "precincts")
// Precincts contain geometry, demographic, vote distribution
// Also used for MGGG, neighbors must be found
// Districts contain representatives
public class Precinct {
    @Id
    private ObjectId id;
    private String uniqueId;
//    private Party winningParty;
    private StateName state;
    @DBRef
    private Election presElection;
    @DBRef
    private Election ussElection;
    @DBRef
    private DemographicData demographicData;
    private String geometry;
}
