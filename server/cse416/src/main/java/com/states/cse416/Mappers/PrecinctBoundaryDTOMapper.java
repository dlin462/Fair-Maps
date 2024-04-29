package com.states.cse416.Mappers;

import com.states.cse416.Models.PrecinctBoundary;
import com.states.cse416.Models.PrecinctBoundaryDTO;
import com.states.cse416.Models.PrecinctDTO;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class PrecinctBoundaryDTOMapper implements Function<PrecinctBoundary, PrecinctBoundaryDTO> {
//    private final
//    private final

    @Override
    public PrecinctBoundaryDTO apply(PrecinctBoundary precinctBoundary) {
        GeometryFactory geometryFactory = new GeometryFactory();
        geometryFactory.createPolygon();
        WKTReader wktReader = new WKTReader(geometryFactory);
        try {
            return new PrecinctBoundaryDTO(
                    precinctBoundary.getId(),
                    wktReader.read(precinctBoundary.getCoordinates())
            );
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
}