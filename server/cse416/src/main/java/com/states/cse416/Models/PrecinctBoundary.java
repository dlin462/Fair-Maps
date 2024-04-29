package com.states.cse416.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "nv_precincts")
@AllArgsConstructor
@NoArgsConstructor
public class PrecinctBoundary {
    @Id
    private ObjectId id;
    private String coordinates;
}
