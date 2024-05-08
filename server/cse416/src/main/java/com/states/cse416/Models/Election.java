package com.states.cse416.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Election {
    private int democratic;
    private int republican;
    private float pctDemocrat;
    private float pctRepublican;
}
