package com.states.cse416.Models;

import com.states.cse416.Models.enums.Party;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.locationtech.jts.geom.Geometry;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "precincts")
public class Precinct {
    @Id
    private ObjectId id;
    @DocumentReference
    private DemographicData demographicData;
    private Party winningParty;
    private Geometry geometry;
}
