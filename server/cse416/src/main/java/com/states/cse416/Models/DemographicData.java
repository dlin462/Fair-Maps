package com.states.cse416.Models;

import com.states.cse416.Models.enums.Race;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DemographicData {
    @Id
    private ObjectId id;
    private double pctWhite;
    private double pctAsian;
    private double pctBlack;
    private double pctHispanic;
    private Race white;
    private Race asian;
    private Race black;
    private Race hispanic;
}
