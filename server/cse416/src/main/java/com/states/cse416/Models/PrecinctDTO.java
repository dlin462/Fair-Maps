package com.states.cse416.Models;

import com.states.cse416.Models.enums.Party;
import com.states.cse416.Models.enums.Race;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.locationtech.jts.geom.Geometry;

@Data
public class PrecinctDTO {
    private DemographicData demographicData;
    private Party party;
    private Geometry geometry;

}
