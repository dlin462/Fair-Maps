package com.states.cse416.Models;

import org.bson.types.ObjectId;
import org.locationtech.jts.geom.Geometry;
import org.springframework.stereotype.Service;

import java.util.function.Function;


public record PrecinctBoundaryDTO(
        ObjectId id,
        Geometry coordinates
) {

}
