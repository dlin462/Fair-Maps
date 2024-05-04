package com.states.cse416.Models;

import com.states.cse416.Models.enums.StateName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "districts")
public class District {
    @Id
    private ObjectId id;
    @Field("DISTRICTNO")
    private int districtNum;
    private StateName state;
    @DocumentReference
    private Representative representative;
    private DemographicData demographicData;
    private String geometry;
}
