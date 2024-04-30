package com.states.cse416.Models;

import com.states.cse416.Models.enums.Race;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "demographics")
public class DemographicData {
    @Id
    private ObjectId id;
    private double TOT_POP22;
    private double WHT_NHSP22;
    private double BLK_NHSP22;
    private double ASN_NHSP22;
    private double HSP_POP22;
    // private double pctWhite;
    // private double pctAsian;
    // private double pctBlack;
    // private double pctHispanic;
    // private Race white;
    // private Race asian;
    // private Race black;
    // private Race hispanic;
}
