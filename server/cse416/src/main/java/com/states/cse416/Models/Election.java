package com.states.cse416.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Election {
    @Field("democratic")
    private int democrat;
    private int republican;
    private float pctDemocrat;
    private float pctRepublican;
}
