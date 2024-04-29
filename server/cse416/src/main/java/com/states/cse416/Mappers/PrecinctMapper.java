package com.states.cse416.Mappers;

import com.states.cse416.Models.Precinct;
import com.states.cse416.Models.PrecinctDTO;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PrecinctMapper {
    PrecisionModel precisionModel = new PrecisionModel();
    GeometryFactory geometryFactory = new GeometryFactory(precisionModel, 4326); // SRID 4326 (WGS 84)

    private final WKTReader wktReader = new WKTReader(geometryFactory);

    public PrecinctDTO convertToPrecinctDTO(Precinct precinct) {
        PrecinctDTO precinctDTO = new PrecinctDTO();
        try {
//            precinctDTO.setParty(precinct.getWinningParty());
//            precinctDTO.setDemographicData(precinct.getDemographicData());
            precinctDTO.setGeometry(wktReader.read(precinct.getGeometry()));
        } catch (ParseException e) {
            System.out.println(e.toString());
        }
        return precinctDTO;
    }
}
