package com.states.cse416.Models;

import com.states.cse416.Models.enums.Race;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DemographicData {
//    @Id
//    private ObjectId id;
    private double vap;
    @Field("pct_wvap")
    private double pctWhite;
    @Field("pct_asianvap")
    private double pctAsian;
    @Field("pct_bvap")
    private double pctBlack;
    @Field("pct_hvap")
    private double pctHispanic;
    @Field("wvap")
    private int whiteVAP;
    @Field("asianvap")
    private int asianVAP;
    @Field("bvap")
    private int blackVAP;
    @Field("hvap")
    private int hispanicVAP;
}
